const tmi = require('tmi.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
// Define configuration options
const opts = {
  identity: {
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    'gubs60'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();
let piloteIQ = 0;
let gubsIQ = 0;
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  const match = commandName.match(/^!qi([gp])([-+]\d*)$/);
  if (match) {
    if (match[1] === 'g') {
      gubsIQ += parseInt(match[2]);
      fs.writeFile('gubs.txt', `Gubs : ${gubsIQ} QI`, () => {
      });
    } else if (match[1] === 'p') {
      piloteIQ += parseInt(match[2]);
      fs.writeFile('pilote.txt', `Pilote : ${piloteIQ} QI`, () => {
      });
    }
    fs.writeFile('crea.txt', `Créateur : ${(gubsIQ + piloteIQ) * 2} QI`, () => {});
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
