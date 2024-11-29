const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log('Starting callback handler...');
    const code = event.queryStringParameters?.code;
    
    if (!code) {
        console.error('No code provided');
        return {
            statusCode: 302,
            headers: {
                'Location': '/?error=no_code'
            }
        };
    }

    try {
        console.log('Exchanging code for token...');
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://eluun.link/callback'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenData = await tokenResponse.json();
        console.log('Token received:', tokenData.access_token ? 'Yes' : 'No');

        if (tokenData.error) {
            console.error('Token error:', tokenData.error);
            return {
                statusCode: 302,
                headers: {
                    'Location': `/?error=${encodeURIComponent(tokenData.error)}`
                }
            };
        }

        // État temporaire dans l'URL pour vérification côté client
        const state = Math.random().toString(36).substring(7);
        
        return {
            statusCode: 302,
            headers: {
                'Location': `/?state=${state}`,
                'Set-Cookie': [
                    `discord_token=${tokenData.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/`,
                    `discord_state=${state}; HttpOnly; Secure; SameSite=Strict; Path=/`
                ].join(', ')
            }
        };
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 302,
            headers: {
                'Location': `/?error=${encodeURIComponent(error.message)}`
            }
        };
    }
};