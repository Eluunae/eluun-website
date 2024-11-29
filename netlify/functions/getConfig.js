// functions/getConfig.js
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            clientId: process.env.DISCORD_CLIENT_ID,
            redirectUri: process.env.REDIRECT_URI
        })
    };
};