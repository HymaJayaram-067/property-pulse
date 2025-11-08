"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertiesByUser = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getAllProperties = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const uploadService_1 = require("../services/uploadService");
// Get all properties
const getAllProperties = async (req, res) => {
    try {
        const { status, propertyType, minPrice, maxPrice, bedrooms, bathrooms, city, state, page = 1, limit = 12, } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (propertyType)
            query.propertyType = propertyType;
        if (city)
            query['location.city'] = new RegExp(city, 'i');
        if (state)
            query['location.state'] = new RegExp(state, 'i');
        if (bedrooms)
            query.bedrooms = { $gte: Number(bedrooms) };
        if (bathrooms)
            query.bathrooms = { $gte: Number(bathrooms) };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const properties = await Property_1.default.find(query)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        const total = await Property_1.default.countDocuments(query);
        res.json({
            success: true,
            properties,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message,
        });
    }
};
exports.getAllProperties = getAllProperties;
// Get single property by ID
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property_1.default.findById(id).populate('owner', 'name email');
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json({
            success: true,
            property,
        });
    }
    catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching property',
            error: error.message,
        });
    }
};
exports.getPropertyById = getPropertyById;
// Create new property
const createProperty = async (req, res) => {
    try {
        const propertyData = req.body;
        const userId = req.user?.userId;
        // Handle image uploads
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            imageUrls = await (0, uploadService_1.uploadMultipleToCloudinary)(req.files);
        }
        const property = await Property_1.default.create({
            ...propertyData,
            images: imageUrls,
            owner: userId,
        });
        const populatedProperty = await Property_1.default.findById(property._id).populate('owner', 'name email');
        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            property: populatedProperty,
        });
    }
    catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating property',
            error: error.message,
        });
    }
};
exports.createProperty = createProperty;
// Update property
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.userId;
        const property = await Property_1.default.findById(id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        // Check if user is the owner
        if (property.owner.toString() !== userId) {
            res.status(403).json({ message: 'Not authorized to update this property' });
            return;
        }
        // Handle new image uploads
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const newImageUrls = await (0, uploadService_1.uploadMultipleToCloudinary)(req.files);
            updateData.images = [...(property.images || []), ...newImageUrls];
        }
        const updatedProperty = await Property_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('owner', 'name email');
        res.json({
            success: true,
            message: 'Property updated successfully',
            property: updatedProperty,
        });
    }
    catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating property',
            error: error.message,
        });
    }
};
exports.updateProperty = updateProperty;
// Delete property
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const property = await Property_1.default.findById(id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        // Check if user is the owner
        if (property.owner.toString() !== userId) {
            res.status(403).json({ message: 'Not authorized to delete this property' });
            return;
        }
        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            for (const imageUrl of property.images) {
                await (0, uploadService_1.deleteFromCloudinary)(imageUrl);
            }
        }
        await Property_1.default.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Property deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting property',
            error: error.message,
        });
    }
};
exports.deleteProperty = deleteProperty;
// Get properties by user
const getPropertiesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const properties = await Property_1.default.find({ owner: userId })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            properties,
            count: properties.length,
        });
    }
    catch (error) {
        console.error('Get user properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user properties',
            error: error.message,
        });
    }
};
exports.getPropertiesByUser = getPropertiesByUser;
//# sourceMappingURL=propertyController.js.map