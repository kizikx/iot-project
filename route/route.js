module.exports = (app) => {
    const controller = require('../controllers/controller');

    app.get('/esp/ping/:who', controller.publishPing);

    app.post('/esp/:what', controller.getTopic);

    app.post('/user', controller.addUser);

    app.post('/login', controller.login)
};