const {failure} = require("../common/response");
const {verify} = require("./verifying");
const {getPartnerPublicKey} = require("./partners");

const MAX_DRIFT_MS = 5 * 60 * 1000;

const skipVerification = process.env.SKIP_SIGNATURE_VERIFICATION === "true";

if(skipVerification && process.env.NODE_ENV === "production"){
    throw new Error("SKIP_SIGNATURE_VERIFICATION must not be set in production");
}

if(skipVerification){
    console.warn("WARNING: signature verification is disabled");
}

function reject(res, message) {
    return res.status(200).json(failure("BAD_REQUEST", message));
}

function signatureMiddleware(req, res, next) {
    if(skipVerification){
        const rawBody = typeof req.body === "string" ? req.body : "";
        try{
            req.body = JSON.parse(rawBody);
        } catch(e) {
            return reject(res, "Invalid JSON");
        }
        req.partner = req.get("PARTNER");
        return next();
    }

    const partner = req.get("PARTNER");
    const timestamp = req.get("TIMESTAMP");
    const signature = req.get("SIGNATURE");

    if(!partner||!timestamp||!signature) {
        return reject(res, "Missing required header");
    }

    const publicKey = getPartnerPublicKey(partner);
    if(!publicKey) {
        return reject(res, "Unknown partner");
    }

    const drift = Math.abs(Date.now() - Number(timestamp));
    if(Number.isNaN(drift)||drift>MAX_DRIFT_MS) {
        return reject(res, "Invalid or expired timestamp");
    }

    let rawBody;
    if(typeof req.body === "string"){
        rawBody = req.body;
    } else {
        rawBody = "";
    }

    let valid = false;
    try {
        valid = verify(partner, timestamp, rawBody, signature, publicKey);
    } catch(e) {
        valid = false;
    }

    if(!valid) {
        return reject(res, "Invalid signature");
    }

    try {
        req.body = JSON.parse(rawBody);
    } catch(e) {
        return reject(res, "Invalid JSON");
    }

    req.partner = partner;
    next();

}

module.exports = {signatureMiddleware, skipVerification};