import express from "express";
import { getUsers ,register,updateUserRole,login,getUsersByRole} from "../controllers/userContoller.js"; 
import { authenticateTokenMiddleware } from "../middleware/authMiddleware.js";
import {authorizeRolesMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router(); 

router.post("/signUp",register)
router.post("/login", login);

router.use(authenticateTokenMiddleware)
router.get("/getAllUser",authorizeRolesMiddleware(["admin"]), getUsers);
router.put("/updateRole/:userId",authorizeRolesMiddleware(["admin"]), updateUserRole);
router.get("/getUserByRole/:role",authorizeRolesMiddleware(["admin"]), getUsersByRole);


export default router;