module.exports = (app) => {
    const controller = require('../controllers/controller');
    const userController = require('../controllers/Usercontroller');
    const auth = require('../middleware/auth');
    const authAdmin = require('../middleware/authAdmin');

    app.post('/esp', auth, controller.getAllEsp);

    app.post('/esp/:id', auth, controller.getEspById);

    app.get('/esp/ping/:who', auth, controller.publishPing);

    app.post('/esp/:what', auth, controller.getTopic);

    app.post('/user', userController.addUser);

    app.patch('/user/:id', auth, userController.updatePassword);

    app.post('/login', userController.login);

    app.post('/logout', auth, userController.logout);

    app.patch('/user/:id/role', authAdmin, userController.updateRole);
};