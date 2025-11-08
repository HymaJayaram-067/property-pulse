import mongoose, { Schema, Types } from 'mongoose';
import { IProperty } from '../types';

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms must be non-negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms must be non-negative'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area must be positive'],
    },
    propertyType: {
      type: String,
      enum: ['house', 'apartment', 'condo', 'land', 'commercial'],
      required: [true, 'Property type is required'],
    },
    status: {
      type: String,
      enum: ['for-sale', 'sold', 'rented'],
      default: 'for-sale',
    },
    images: [{
      type: String,
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });

const Property = mongoose.model<IProperty>('Property', propertySchema);

export default Property;
