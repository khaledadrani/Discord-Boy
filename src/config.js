// const result = require('dotenv').config(); //load env vars
// if (result.error) { //check if env vars are loaded 
//     console.error("Error while loading the .env file"); // send message for error - no token 
//   throw result.error
// }

// module.exports = {
//   bot_token: process.env.DISCORDBOT_JS_TOKEN,
//   webhook_id: process.env.WEBHOOK_ID,
//   webhook_token: process.env.WEBHOOK_TOKEN,
//   prefix:process.env.PREFIX
// };

// config.js 
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.error("Error while loading the .env file"); // send message for error - no token 
  throw result.error;
}
const { parsed: envs } = result;
//console.log(envs);
module.exports = envs;

//this file is thanks to 
//https://www.google.com/search?q=nodejs+manipulating+.env+files&oq=nodejs+manipulating+.env+files&aqs=chrome..69i57.5967j0j4&sourceid=chrome&ie=UTF-8