const mongoose = require('mongoose');
const { config } = require('../config/config');

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.vvexxth.mongodb.net/rentProject`);
  console.log('mongo connect...');
}