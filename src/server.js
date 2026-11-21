const result = require("dotenv").config()
if(result.error){
    throw result.error;
}

const express = require("express");
const  {success, failure} = require("./common/response");
const {signatureMiddleware} = require("./security/middleware");
const {accountInfo} = require("./account/account-controller");
const {pool} = require("./db/connection");

const app = express();

app.use(express.text({type:"*/*"}));
app.use("/api/v1", signatureMiddleware);

app.post("/api/v1/ping", (req, res)=>{
    res.status(200).json(success({message: "pong"}))
});

app.post("/api/v1/account/info", accountInfo);

app.use((err, req, res, next) => {
    if(err instanceof SyntaxError){
        return res.status(200).json(failure("BAD_REQUEST", "Invalid JSON"));
    }
    console.error(err);
    res.status(200).json(failure("INTERNAL_SERVER_ERROR", "Internal Server Error"));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Scheduling Service listening on port ${port}`);
});

function shutdown() {
    server.close(async() => {
        await pool.end();
        process.exit(0);
    });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);