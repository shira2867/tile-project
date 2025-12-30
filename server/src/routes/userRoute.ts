import express from "express";
import { getUsers ,createUser} from "../controllers/userContoller.js"; 
const router = express.Router(); 
router.get("/getAllUser", getUsers);
router.post("/createUser",createUser)

export default router;