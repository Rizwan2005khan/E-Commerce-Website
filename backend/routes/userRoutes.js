import express from "express";
import { 
    createUser, 
    loginUser, 
    logoutCurrentUser,
    getCurrentUserProfile,
    getAllUsers,
    updateCurrentlyUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
} from '../controller/userController.js';

import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
// http://localhost:5000/api/users/auth
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);
router.post('/', createUser);

// Admin Routes
router.get('/', authenticate, authorizedAdmin, getAllUsers);

// Authenticated User Routes
router
    .route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentlyUserProfile);


router
.route('/:id')
.delete(authenticate,authorizedAdmin, deleteUserById).get(authenticate,authorizedAdmin,getUserById)
.put(authenticate, authorizedAdmin, updateUserById)

export default router;
