import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface MyUserPayload {
    _id: string;
    role: string;
    email:string
}

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

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined|MyUserPayload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

req.user = decoded as MyUserPayload;    next();
  });
}





export function authorizeRolesMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}


