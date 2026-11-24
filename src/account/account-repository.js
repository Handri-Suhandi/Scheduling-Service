const {pool} = require("../db/connection");

async function findByPartnerUserId(partnerUserId){
    const [rows] = await pool.query(
        "SELECT partner, partner_user_id, token, status FROM account WHERE partner_user_id = ? LIMIT 1",
        [partnerUserId]
    );
    return rows[0];
}

module.exports = {findByPartnerUserId};