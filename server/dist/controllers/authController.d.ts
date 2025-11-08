import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addToFavorites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removeFromFavorites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFavorites: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map