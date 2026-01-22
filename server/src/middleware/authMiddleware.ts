import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/userService.js";

import {MyUserPayload} from "../models/user.js"


export interface AuthRequest extends Request {
    user?: MyUserPayload; 
}

export function authenticateTokenMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
      console.log("token :", token); 
  if (!token) {
    
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async(err: VerifyErrors | null, decoded: JwtPayload | any) => {
    if (err)
    {
      return res.status(403).json({ message: "Invalid token" });
    }
      const payload = decoded as MyUserPayload;
      console.log("user payload",payload)

    try 
    {
      const user = await getUserById(payload._id); 
      console.log("user middleware",user)
      if (!user || user.role !== payload.role)
      {
        res.clearCookie("token"); 
        return res.status(401).json({ message: "User data changed, please login again" });
      }
    req.user = user as MyUserPayload;  
    next();
  }
   catch (error)
    {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

}





export function authorizeRolesMiddleware(allowedRoles: string[]) 
{
  return (req: AuthRequest, res: Response, next: NextFunction) => 
    {
        console.log('req.user:', req.user);
    if (!req.user || typeof req.user === "string") 
    {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole))
    {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}


