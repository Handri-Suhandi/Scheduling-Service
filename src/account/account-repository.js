const {pool} = require("../db/connection");

async function findByPartnerUserId(partnerUserId){
    const [rows] = await pool.query(
        "SELECT partner, partner_user_id, token, status FROM account WHERE partner_user_id = ? LIMIT 1",
        [partnerUserId]
    );
    return rows[0];
}

async function insertAccount(partner, partner_user_id, email, token){
    await pool.query(
        "INSERT INTO account (partner, partner_user_id, email, token) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE partner_user_id = partner_user_id",
        [partner, partner_user_id, email, token]
    );
}

module.exports = {findByPartnerUserId, insertAccount};