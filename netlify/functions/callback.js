const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log('Starting callback handler...');
    const code = event.queryStringParameters?.code;
    
    if (!code) {
        return {
            statusCode: 302,
            headers: { 'Location': '/?error=no_code' }
        };
    }

    try {
        // 1. Échange code contre token
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

        // 2. Récupérer infos utilisateur
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userData = await userResponse.json();

        // 3. Ajouter au serveur avec rôle
        const guildResponse = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${userData.id}`, {
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

        if (!guildResponse.ok) {
            throw new Error('Failed to add user to guild');
        }

        return {
            statusCode: 302,
            headers: {
                'Location': '/',
                'Set-Cookie': `discord_token=${tokenData.access_token}; HttpOnly; Secure; Path=/`
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