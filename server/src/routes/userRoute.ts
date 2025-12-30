import express from "express";
import { getUsers ,register,updateUserRole,login} from "../controllers/userContoller.js"; 
import { authenticateTokenMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router(); 

router.post("/signIn",register)
router.post("/login", login);
router.use(authenticateTokenMiddleware)
router.get("/getAllUser", getUsers);
router.put("updateRole/:userId", updateUserRole);


export default router;