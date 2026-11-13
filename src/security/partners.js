const fs = require("node:fs");
const path = require("node:path");

const partnerKeys = {
    GETSUYOUBI_ID: fs.readFileSync(
        path.join(__dirname, "../../keys/test-public.pem"),"utf8"
    ),
};

function getPartnerPublicKey(partnerId) {
    return partnerKeys[partnerId] || null;
}

module.exports = {getPartnerPublicKey};