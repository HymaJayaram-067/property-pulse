import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadToCloudinary: (fileBuffer: Buffer, fileName: string) => Promise<string>;
export declare const uploadMultipleToCloudinary: (files: Express.Multer.File[]) => Promise<string[]>;
export declare const deleteFromCloudinary: (imageUrl: string) => Promise<void>;
//# sourceMappingURL=uploadService.d.ts.map