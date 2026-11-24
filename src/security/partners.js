const partnerKeys = {};

async function loadPartnerKeys(){
    const {HASHICORP_URL, HASHICORP_TOKEN, HASHICORP_SECRET_PATH} = process.env;
    if(!HASHICORP_URL || !HASHICORP_TOKEN || !HASHICORP_SECRET_PATH){
        throw new Error("Missing HASHICORP_URL, HASHICORP_TOKEN or HASHICORP_SECRET_PATH");
    }

    const response = await fetch(`${HASHICORP_URL}/v1/${HASHICORP_SECRET_PATH}`, {
        headers: {"X-Vault-Token" : HASHICORP_TOKEN},
    });
    if(!response.ok){
        throw new Error(`Vault request failed with status ${response.status}`);
    }

    const body = await response.json();
    partnerKeys.GETSUYOUBI_ID = body.data.data.key;
}

function getPartnerPublicKey(partnerId){
    return Object.hasOwn(partnerKeys, partnerId) ? partnerKeys[partnerId] : null;
}

module.exports = {loadPartnerKeys, getPartnerPublicKey};