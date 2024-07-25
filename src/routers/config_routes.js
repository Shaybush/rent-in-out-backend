const indexR = require('./index');
const usersR = require('./users');
const postR = require('./posts');
const categoriesR = require('./categories');

exports.routesInit = (app) => {
  app.use('/', indexR);
  app.use('/users', usersR);
  app.use('/posts', postR);
  app.use('/categories', categoriesR);
};