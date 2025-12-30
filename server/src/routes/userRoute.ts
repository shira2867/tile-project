import express from "express";
import { getUsers ,createUser,updateUserRole} from "../controllers/userContoller.js"; 
const router = express.Router(); 
router.get("/getAllUser", getUsers);
router.post("/createUser",createUser)
router.put("updateRole/:userId", updateUserRole);


export default router;