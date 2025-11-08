import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare const getAllProperties: (req: Request, res: Response) => Promise<void>;
export declare const getPropertyById: (req: Request, res: Response) => Promise<void>;
export declare const createProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProperty: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPropertiesByUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=propertyController.d.ts.map