const test = require("node:test");
const assert = require("node:assert");

for (const name of ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"]) {
    process.env[name] = "unused";
}

const repository = require("./account-repository");
const {accountInfo,accountBind} = require("./account-controller");

const PARTNER = "GETSUYOUBI_ID";
const account = { partner: PARTNER, partner_user_id: "user1", token: "tok123", status: "ENABLED" };

async function call(body, foundAccount, partner = PARTNER) {
    repository.findByPartnerUserId = async () => foundAccount;
    let result;
    const res = {
        status() { return this; },
        json(payload) { result = payload; return payload; },
    };
    await accountInfo({ body, partner }, res);
    return result;
}

test("blank partnerUserId is BAD_REQUEST", async () => {
    const result = await call({ partnerUserId: "  " }, undefined);
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
    assert.strictEqual(result.status, null);
});

test("unknown user is UNREGISTERED", async () => {
    const result = await call({ partnerUserId: "user1" }, undefined);
    assert.strictEqual(result.resultInfo.responseCode, "SUCCESS");
    assert.strictEqual(result.status, "UNREGISTERED");
});

test("user of another partner is BAD_REQUEST", async () => {
    const result = await call({ partnerUserId: "user1", token: "tok123" }, account, "OTHER");
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
});

test("registered user with blank token is BAD_REQUEST", async () => {
    const result = await call({ partnerUserId: "user1", token: "" }, account);
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
});

test("registered user with wrong token is BAD_REQUEST", async () => {
    const result = await call({ partnerUserId: "user1", token: "wrong" }, account);
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
});

test("registered user with valid token is REGISTERED", async () => {
    const result = await call({ partnerUserId: "user1", token: "tok123" }, account);
    assert.strictEqual(result.status, "REGISTERED");
});

test("frozen user with valid token is FROZEN", async () => {
    const result = await call({ partnerUserId: "user1", token: "tok123" }, { ...account, status: "FROZEN" });
    assert.strictEqual(result.status, "FROZEN");
});

test("unknown account status is an error, not REGISTERED", async () => {
    await assert.rejects(call({ partnerUserId: "user1", token: "tok123" }, { ...account, status: "DELETED" }));
});

async function callBind(body, foundAccount, partner = PARTNER) {
    repository.insertAccount = async () => {};
    repository.findByPartnerUserId = async () => foundAccount;
    let result;
    const res = {
        status() { return this; },
        json(payload) { result = payload; return payload; },
    };
    await accountBind({ body, partner }, res);
    return result;
}

const bindBody = { partnerUserId: "user1", registrationData: { email: "a@b.com", token: "tok123" } };

test("bind with a missing field is BAD_REQUEST", async () => {
    const result = await callBind({ partnerUserId: "user1", registrationData: { email: "a@b.com" } }, account);
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
});

test("bind creates the account and returns its token", async () => {
    const result = await callBind(bindBody, account);
    assert.strictEqual(result.resultInfo.responseCode, "SUCCESS");
    assert.strictEqual(result.token, "tok123");
    assert.strictEqual(result.status, "ENABLED");
});

test("bind replay returns the stored token", async () => {
    const result = await callBind({ ...bindBody, registrationData: { email: "x@y.com", token: "new" } }, account);
    assert.strictEqual(result.token, "tok123");
});

test("bind for a user of another partner is BAD_REQUEST", async () => {
    const result = await callBind(bindBody, { ...account, partner: "OTHER" });
    assert.strictEqual(result.resultInfo.responseCode, "BAD_REQUEST");
});