const {success, failure} = require("../common/response");
const repository = require("./account-repository");
const crypto = require("node:crypto");

function isNonBlank(value){
    return typeof value === "string" && value.trim() !== "";
}

function badRequest(res){
    return res.status(200).json({...failure("BAD_REQUEST", "Invalid Field"), status: null});
}

function tokenMatches(provided, stored) {
    if (!isNonBlank(provided) || !isNonBlank(stored)) {
        return false;
    }
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(stored, "utf8");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function accountInfo(req, res){
    const {partnerUserId, token} = req.body ?? {};

    if(!isNonBlank(partnerUserId)){
        return badRequest(res);
    }

    const account = await repository.findByPartnerUserId(partnerUserId);
    if(!account){
        return res.status(200).json(success({status : "UNREGISTERED"}));
    }
    if(account.partner !== req.partner){
        return badRequest(res);
    }
    if(!isNonBlank(token) || !tokenMatches(token, account.token)){
        return badRequest(res);
    }
    if (account.status === "FROZEN"){
        return res.status(200).json(success({ status: "FROZEN" }));
    }
    if (account.status === "ENABLED"){
        return res.status(200).json(success({ status: "REGISTERED" }));
    }
    throw new Error(`Unexpected account status: ${account.status}`);

}

module.exports = {accountInfo};