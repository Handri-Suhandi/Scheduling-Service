const crypto = require("node:crypto");

function verify(partnerId, epochMilli, rawBody, signature, publicKey){
    const signingPayload = `${partnerId}+${epochMilli}+${rawBody}`;
    return crypto
    .createVerify("RSA-SHA256")
    .update(signingPayload, "utf8")
    .verify(publicKey, signature, "base64");
}

module.exports = {verify};