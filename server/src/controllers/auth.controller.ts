import { Request, Response } from "express";
import User from "../models/User";
import { fail, success } from "../utils/api";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookies";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/tokens";

export const register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    const exist = await User.findOne({ email });
    
    if(exist) return res.status(409).json(fail('Email already registered'));

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);

    res.status(201).json(
        success(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    selectedTemplate: user.selectedTemplate
                },
                accessToken,
            },
            'User registered successfully'
        )
    )
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || !( await user.comparePassword(password))) {
        return res.status(401).json(fail('Invalid credentials'));
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);

    res.json(
        success(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    selectedTemplate: user.selectedTemplate,
                },
                accessToken,
            },
            'Logged in successfully'
        )
    ) 
}

export const refresh = async ( req: Request, res: Response ) => {
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).json(fail('Refresh token missing'));

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        if(!user) return res.status(401).json(fail('User not found'));

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id);
        setRefreshCookie(res, refreshToken);

        res.json(
            success(
                {
                    user,
                    accessToken
                },
                'Token refreshed successfully'
            )
        )
    } catch (error) {
        return res.status(401).json(fail('Inavlid or expired refreshToken'));
    }
}

export const logout = async(req: Request, res: Response) => {
    clearRefreshCookie(res);
    res.json(success(null, 'Logged out successfully'));
}

export const me = async( req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select('-password');
    if(!user) return res.status(404).json(fail('User not found'));
    res.json(success(user, 'Current user fetched'));
}