// netlify/functions/addRole.js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const roleId = process.env.DISCORD_ROLE_ID;

if (!token || !guildId || !roleId) {
  console.error('Missing environment variables');
  process.exit(1);
}

client.login(token);

client.once('ready', () => {
  console.log('Bot is online!');
});

exports.handler = async (event, context) => {
  console.log('Handler function called');
  const userId = event.queryStringParameters.userId;
  console.log('User ID:', userId);

  if (!userId) {
    return {
      statusCode: 400,
      body: 'User ID is missing.',
    };
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    console.log('Guild fetched:', guild.name);
    const member = await guild.members.fetch(userId);
    console.log('Member fetched:', member.user.tag);
    const role = guild.roles.cache.get(roleId);
    console.log('Role fetched:', role.name);

    if (member && role) {
      await member.roles.add(role);
      console.log('Role assigned successfully');
      return {
        statusCode: 200,
        body: 'Role assigned successfully!',
      };
    } else {
      console.log('Member or role not found');
      return {
        statusCode: 404,
        body: 'Member or role not found.',
      };
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: 'An error occurred.',
    };
  }
};