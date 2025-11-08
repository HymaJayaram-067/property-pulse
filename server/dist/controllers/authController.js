"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.removeFromFavorites = exports.addToFavorites = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }
        // Create new user
        const user = await User_1.default.create({
            name,
            email,
            password,
            favorites: [],
        });
        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and include password field
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};
exports.login = login;
// Get current user profile
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.userId)
            .select('-password')
            .populate('favorites');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message,
        });
    }
};
exports.getMe = getMe;
// Add property to favorites
const addToFavorites = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if already in favorites
        if (user.favorites.includes(propertyId)) {
            res.status(400).json({ message: 'Property already in favorites' });
            return;
        }
        user.favorites.push(propertyId);
        await user.save();
        res.json({
            success: true,
            message: 'Property added to favorites',
            favorites: user.favorites,
        });
    }
    catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to favorites',
            error: error.message,
        });
    }
};
exports.addToFavorites = addToFavorites;
// Remove property from favorites
const removeFromFavorites = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.favorites = user.favorites.filter((id) => id.toString() !== propertyId);
        await user.save();
        res.json({
            success: true,
            message: 'Property removed from favorites',
            favorites: user.favorites,
        });
    }
    catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from favorites',
            error: error.message,
        });
    }
};
exports.removeFromFavorites = removeFromFavorites;
// Get user's favorite properties
const getFavorites = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId).populate({
            path: 'favorites',
            populate: { path: 'owner', select: 'name email' },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            favorites: user.favorites,
        });
    }
    catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            error: error.message,
        });
    }
};
exports.getFavorites = getFavorites;
//# sourceMappingURL=authController.js.map