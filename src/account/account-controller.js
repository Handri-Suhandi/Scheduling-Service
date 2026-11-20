const {success, failure} = require("../common/response")
const {findByPartnerUser} = require("./account-repository")

function isNonBlank(value){
    return typeof value === "string" && value.trim() !== "";
}

async function accountInfo(req, res, next){
    try{
        const {partnerUserId, token} = req.body ?? {};

        if(!isNonBlank(partnerUserId)){
            return res.status(200).json(failure("BAD_REQUEST", "Invalid Field"));
        }

        const account = await findByPartnerUser(req.partner, partnerUserId);

        if(!account){
            return res.status(200).json(success({status: "UNREGISTERED"}));
        }

        if(!isNonBlank(token) || token !== account.token){
            return res.status(200).json(failure("BAD_REQUEST", "Invalid Field"));
        }

        const status = account.status === "FROZEN" ? "FROZEN" : "REGISTERED";
        return res.status(200).json(success({status}));
    } catch(err) {
        next(err);
    }
}

module.exports = {accountInfo};