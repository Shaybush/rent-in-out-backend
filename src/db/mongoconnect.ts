import mongoose from 'mongoose';
import { config } from '../config/config';

main().catch((err) => console.error('It looks like the .env file is missing.'));

async function main() {
	await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.vvexxth.mongodb.net/rentProject`);
	console.log('mongo connect...');
}
