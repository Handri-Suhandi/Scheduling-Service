const express = require("express");
const  {success, failure} = require("./common/response");
const {signatureMiddleware} = require("./security/middleware");

const app = express();

app.use(express.text({type:"*/*"}));
app.use("/api/v1", signatureMiddleware);

app.post("/api/v1/ping", (req, res)=>{
    res.status(200).json(success({message: "pong"}))
});

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