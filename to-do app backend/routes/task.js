const express = require('express');
const routes = express.Router();
const verify = require('../middleware/verify');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, taskStatusUpdate } = require('../controllers/task');

routes.post('/task', verify, createTask);
routes.get('/All-task', verify,  getAllTasks );
routes.get('/task:id', verify,  getTaskById );
routes.put('/task', verify, updateTask );
routes.put('/status', verify, taskStatusUpdate );
routes.delete('/task', verify, deleteTask)

module.exports = routes;