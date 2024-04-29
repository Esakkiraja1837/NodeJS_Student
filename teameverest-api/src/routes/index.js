const { UserController, AuthController, RoleController, ClassroomController, LocationController, AccessoriesController, StatusController, CorporateController } = require('../controllers');

const getRoutes = router => {
  router.get('/', (req, res) => res.send({ message: 'Team Everest Application Running' }));
  router.get('/ping', (req, res) => res.send({ status: 'active', time: new Date() }));
  router.post('/login', AuthController.login);
  router.post('/logout', AuthController.logout);
  router.post('/setup-password', AuthController.setupPassword);
  router.post('/forgot-password', AuthController.forgotPassword);
  // User related API's
  router.post('/users', UserController.createUser);
  router.get('/users', UserController.getUsers);
  router.get('/users/:userId', UserController.findById);
  router.put('/users/:userId', UserController.updateUser);
  router.delete('/users/:userId', UserController.deleteUser);
  // Roles related API's
  router.get('/roles', RoleController.getRoles);
  router.post('/roles', RoleController.createRole);
  router.get('/roles/search', RoleController.searchRole);
  router.get('/roles/:id', RoleController.findById);
  router.delete('/roles/:id', RoleController.deleteRole);
  // Class-room related API's
  router.post('/classrooms', ClassroomController.createClassroom);
  router.get('/classrooms/search', ClassroomController.searchClassrooms);
  router.get('/classrooms', ClassroomController.fetchAll);
  router.get('/classrooms/:id', ClassroomController.findById);
  router.put('/classrooms/:id', ClassroomController.updateClassroom);
  router.delete('/classrooms/:id', ClassroomController.deleteClassroom);
  // Location related API's
  router.post('/locations', LocationController.createLocation);
  router.get('/locations/search', LocationController.searchLocations);
  router.get('/locations', LocationController.fetchAll);
  router.get('/locations/:id', LocationController.findById);
  router.put('/locations/:id', LocationController.updateLocation);
  router.delete('/locations/:id', LocationController.deleteLocation);
  // Accessories related API's
  router.post('/accessories/', AccessoriesController.createAccessory);
  router.get('/accessories/search', AccessoriesController.searchAccessories);
  router.get('/accessories', AccessoriesController.fetchAll);
  router.get('/accessories/:id', AccessoriesController.findById);
  router.put('/accessories/:id', AccessoriesController.updateAccessory);
  router.delete('/accessories/:id', AccessoriesController.deleteAccessory);
  // Status related API's
  router.post('/status', StatusController.createStatus);
  router.get('/status', StatusController.fetchAll);
  // Corporate related API's
  router.post('/corporate', CorporateController.createCorporate);
  router.get('/corporate/search', CorporateController.searchCorporate);
  router.get('/corporate', CorporateController.fetchAll);
  router.get('/corporate/:id', CorporateController.findById);
  router.put('/corporate/:id', CorporateController.updateCorporate);
  router.delete('/corporate/:id', CorporateController.deleteCorporate);

  return router;
};

module.exports = getRoutes;
