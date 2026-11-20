const {pool} = require("../db/connection");

async function findByPartnerUser(partner, partnerUserId){
    const [rows] = await pool.query(
        "SELECT * FROM account WHERE partner = ? AND partner_user_id = ?",
        [partner, partnerUserId]
    );
    if(rows.length > 0){
        return rows[0];
    } else {
        return null;
    }
}

module.exports = {findByPartnerUser};