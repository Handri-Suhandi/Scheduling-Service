function success(data = {}) {
    return {
        ...data,
        resultInfo: {
            success: true,
            responseCode: "SUCCESS",
            responseMessage: "Successful"
        },
    };
}

function failure(responseCode, responseMessage) {
    return {
        resultInfo: {
            success: false,
            responseCode,
            responseMessage,
        },
    };
}

module.exports = {success, failure};