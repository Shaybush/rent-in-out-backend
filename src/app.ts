import { NextFunction, Request, Response } from 'express';

import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import { routesInit } from './routers/config_routes';
import { sockets } from './routers/socket';
import 'dotenv/config';
import './db/mongoconnect';

const app = express();

// configuration urls to orgin
const originUrls = [
	'https://rentinout.onrender.com',
	'http://rentinout.onrender.com',
	'http://localhost:3000',
	'https://rentinout.netlify.app',
	'http://rentinout.netlify.app',
	'http://localhost:5173',
	'https://rent-in-out.netlify.app',
	'https://rent-in-out-front.vercel.app',
	'http://localhost:3001',
];

app.use(
	cors({
		origin: originUrls,
		credentials: true,
	})
);
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 5 } }));
app.use(express.json());
app.use(session({ secret: 'cats' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, _res: Response, next: NextFunction) => {
	console.log(req.method, req.originalUrl);
	next();
});

routesInit(app);

const server = http.createServer(app);
// socket io
const io = new Server(server, {
	cors: {
		origin: originUrls,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
});

app.get('/', (req: Request, res: Response) => {
	res.json('Socket ready');
});

let port = process.env.PORT || 3001;
server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
io.on('connection', sockets);
