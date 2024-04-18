const { Router } = require("express");
const appointmentController = require('../controllers/appoinment/appointment.controller');
const router = Router();

router.post('/create', appointmentController.createAppointment);
router.post('/update-status', appointmentController.updateStatusAppointment);
router.get('/list-time', appointmentController.getAvailableTimeSlots);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.post('/query', appointmentController.getListAppointmentQuery)

module.exports = router;
