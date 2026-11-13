const crypto = require("node:crypto");

function sign(partnerId, epochMilli, payload, privateKey){
    const signingPayload = `${partnerId}+${epochMilli}+${payload}`;
    return crypto
    .createSign("RSA-SHA256")
    .update(signingPayload, "utf8")
    .sign(privateKey, "base64");
}

module.exports = {sign};