import mongoose from 'mongoose';
import { envConfig } from '../config/config-env';

main().catch((err) => console.error('It looks like the .env file is missing.'));

async function main() {
	await mongoose.connect(
		`mongodb+srv://${envConfig.userDb}:${envConfig.passDb}@cluster0.vvexxth.mongodb.net/rentProject`
	);
	console.log('mongo connect...');
}
