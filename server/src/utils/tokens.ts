import jwt, { SignOptions } from "jsonwebtoken";

type JwtPayload = { id: string};

const generateToken = (id: string, expiresIn: SignOptions["expiresIn"]) => jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn });

export const generateAccessToken = (id: string) => generateToken(id, process.env.JWT_ACCESS_EXPIRES_IN! as SignOptions["expiresIn"]);

export const generateRefreshToken = (id: string) => generateToken(id, process.env.JWT_REFRESH_EXPIRES_IN! as SignOptions["expiresIn"]);

export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;