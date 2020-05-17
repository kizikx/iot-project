module.exports = (app) => {
    const controller = require('../controllers/controller');
    const userController = require('../controllers/Usercontroller');
    const auth = require('../middleware/auth');
    const authAdmin = require('../middleware/authAdmin');

    app.get('/esp', auth, controller.getAllEsp);

    app.get('/esp/:id', auth, controller.getEspById);

    app.patch('/esp/:id', auth, controller.updateEsp);

    app.get('/esp/ping/:who', auth, controller.publishPing);

    app.get('/esp/:what', auth, controller.getTopic);

    app.post('/login', userController.login);

    app.post('/user', authAdmin, userController.addUser);

    app.patch('/user/:username', auth, userController.updatePassword);

    app.delete('/user/:username', authAdmin, userController.deleteUser);

    app.patch('/user/:username/role', authAdmin, userController.updateRole);
};