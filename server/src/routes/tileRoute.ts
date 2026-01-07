import express from "express";
import { getTiles ,createTiles,updateTileColor,deleteTile,getColorEnum} from "../controllers/tileController.js"; 
import { authenticateTokenMiddleware } from "../middleware/authMiddleware.js";
import {authorizeRolesMiddleware} from "../middleware/authMiddleware.js";
const router = express.Router(); 

router.use(authenticateTokenMiddleware)
router.get("/getAllTiles",authorizeRolesMiddleware(['admin','moderator','editor','viewer']), getTiles);
router.post("/createTile",authorizeRolesMiddleware(['admin','moderator']),createTiles)
router.put("/updateTile/:tileId",authorizeRolesMiddleware(['admin','moderator','editor']),updateTileColor)
router.delete("/deleteTile/:tileId",authorizeRolesMiddleware(['admin','moderator']),deleteTile)
router.get("/colors", getColorEnum);



export default router;