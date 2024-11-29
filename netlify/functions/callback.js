const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Log the incoming request
    console.log('Received event:', {
        method: event.httpMethod,
        code: event.queryStringParameters?.code || 'No code'
    });

    try {
        const code = event.queryStringParameters?.code || JSON.parse(event.body)?.code;
        
        if (!code) {
            throw new Error('No authorization code provided');
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
            throw new Error(tokenData.error);
        }

        // Get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userData = await userResponse.json();
        console.log('User data:', userData);

        // Add user to server with role
        if (process.env.GUILD_ID && process.env.ROLE_ID) {
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
                'Set-Cookie': `discord_user=${userData.id}; Path=/; HttpOnly`
            }
        };
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 302,
            headers: {
                'Location': '/?error=' + encodeURIComponent(error.message)
            }
        };
    }
};