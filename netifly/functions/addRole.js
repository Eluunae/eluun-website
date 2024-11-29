// netlify/functions/addRole.js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const token = process.env.MTMxMTk3NjMwMTM1MTAxNDQ0Mg.GlP4Sw.RhDs6nsFFLucxXu4wk_0j0A1fZJ5OvtpUZZ_UE;
const guildId = process.env.1174313475552591933;
const roleId = process.env.1311962320481812582;

client.login(token);

exports.handler = async (event, context) => {
  const userId = event.queryStringParameters.userId;

  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    const role = guild.roles.cache.get(roleId);

    if (member && role) {
      await member.roles.add(role);
      return {
        statusCode: 200,
        body: 'Role assigned successfully!',
      };
    } else {
      return {
        statusCode: 404,
        body: 'Member or role not found.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'An error occurred.',
    };
  }
};