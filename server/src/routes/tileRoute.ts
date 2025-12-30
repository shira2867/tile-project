import express from "express";
import { getTiles ,createTiles} from "../controllers/tileController.js"; 
const router = express.Router(); 
router.get("/getAll", getTiles);
router.post("/createTile",createTiles)

export default router;