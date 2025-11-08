import { Request, Response } from 'express';
import Property from '../models/Property';
import { AuthRequest } from '../types';
import {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} from '../services/uploadService';

// Get all properties
export const getAllProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      status,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (state) query['location.state'] = new RegExp(state as string, 'i');
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(query);

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
  } catch (error: any) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message,
    });
  }
};

// Get single property by ID
export const getPropertyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate(
      'owner',
      'name email'
    );

    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    res.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message,
    });
  }
};

// Create new property
export const createProperty = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const propertyData = req.body;
    const userId = req.user?.userId;

    // Handle image uploads
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = await uploadMultipleToCloudinary(req.files);
    }

    const property = await Property.create({
      ...propertyData,
      images: imageUrls,
      owner: userId,
    });

    const populatedProperty = await Property.findById(property._id).populate(
      'owner',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property: populatedProperty,
    });
  } catch (error: any) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message,
    });
  }
};

// Update property
export const updateProperty = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user?.userId;

    const property = await Property.findById(id);

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
      const newImageUrls = await uploadMultipleToCloudinary(req.files);
      updateData.images = [...(property.images || []), ...newImageUrls];
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json({
      success: true,
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error: any) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message,
    });
  }
};

// Delete property
export const deleteProperty = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const property = await Property.findById(id);

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
        await deleteFromCloudinary(imageUrl);
      }
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message,
    });
  }
};

// Get properties by user
export const getPropertiesByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const properties = await Property.find({ owner: userId })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      properties,
      count: properties.length,
    });
  } catch (error: any) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user properties',
      error: error.message,
    });
  }
};
