import express from "express";
import { getTiles ,createTiles,updateTileColor,deleteTile} from "../controllers/tileController.js"; 
const router = express.Router(); 
router.get("/getAll", getTiles);
router.post("/createTile",createTiles)
router.put("/updateTile/:tileId",updateTileColor)
router.delete("/deleteTile/:tileId",deleteTile)



export default router;