import { Router } from "express";
import { 
    getAllVehicles,
    getById,
    createVehicle,
    updateVehiclePosition,
    deleteOwnVehicle,
    deleteAnyVehicle,
 } from "../controllers/car.controllers.js"
 import { auth, isAdmin } from "../middleware/auth.middleware.js";

 const router = Router();

router.use(auth);

router.get('/all', isAdmin, getAllVehicles);

router.get('/', getById);

router.post('/', createVehicle);

router.patch('/:id', updateVehiclePosition);

router.delete('/:id', deleteOwnVehicle);

router.delete('/admin/:id', isAdmin, deleteAnyVehicle);

export default router;