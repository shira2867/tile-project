import express from "express";
import { getTiles ,createTiles,updateTileColor,deleteTile} from "../controllers/tileController.js"; 
import { authenticateTokenMiddleware } from "../middleware/authMiddleware.js";
import {authorizeRolesMiddleware} from "../middleware/authMiddleware.js";
const router = express.Router(); 

router.use(authenticateTokenMiddleware)
router.get("/getAll",authorizeRolesMiddleware(['admin','moderator','editor','viewer']), getTiles);
router.post("/createTile",authorizeRolesMiddleware(['admin','moderator']),createTiles)
router.put("/updateTile/:tileId",authorizeRolesMiddleware(['admin','moderator','editor']),updateTileColor)
router.delete("/deleteTile/:tileId",authorizeRolesMiddleware(['admin','moderator']),deleteTile)



export default router;