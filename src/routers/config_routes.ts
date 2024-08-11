import indexR from './index';
import usersR from './users';
import postR from './posts';
import categoriesR from './categories';
import { Express } from 'express';

export const routesInit = (app: Express) => {
	app.use('/', indexR);
	app.use('/users', usersR);
	app.use('/posts', postR);
	app.use('/categories', categoriesR);
};
