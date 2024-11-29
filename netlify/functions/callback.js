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
        // Échange du code contre un token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://eluun.link/callback',
                scope: 'identify guilds.join'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
            throw new Error(tokenData.error);
        }

        // Récupération des infos utilisateur
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userData = await userResponse.json();

        // Ajouter l'utilisateur au serveur
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

        return {
            statusCode: 302,
            headers: {
                'Location': '/',
                'Set-Cookie': `discord_user=${userData.id}; HttpOnly; Secure; Path=/`
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