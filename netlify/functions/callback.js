const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log('Received event:', {
        method: event.httpMethod,
        code: event.queryStringParameters?.code,
        headers: event.headers
    });

    try {
        const code = event.queryStringParameters?.code;
        
        if (!code) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'No authorization code provided' })
            };
        }

        // Exchange code for token
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
        console.log('Token response:', tokenData);

        if (tokenData.error) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: tokenData.error })
            };
        }

        // Get user info and add to guild
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userData = await userResponse.json();
        console.log('User data:', userData);

        // Add to guild
        if (process.env.GUILD_ID) {
            await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${userData.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token: tokenData.access_token,
                    roles: [process.env.ROLE_ID]
                })
            });
        }

        return {
            statusCode: 302,
            headers: {
                'Location': '/',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};