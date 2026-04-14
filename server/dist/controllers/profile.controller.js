"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const api_1 = require("../utils/api");
const getProfile = async (req, res) => {
    const user = await User_1.default.findById(req.user?.id).select('-password');
    if (!user)
        return res.status(404).json((0, api_1.fail)('User not found'));
    res.json((0, api_1.success)(user, 'Profile fetched successfully'));
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const existingUser = await User_1.default.findById(req.user?.id);
    if (!existingUser)
        return res.status(404).json((0, api_1.fail)('User not found'));
    const emailOwner = await User_1.default.findOne({
        email: req.body.email,
        _id: { $ne: req.user?.id },
    });
    if (emailOwner) {
        return res.status(409).json((0, api_1.fail)('Email is already in use'));
    }
    existingUser.name = req.body.name;
    existingUser.email = req.body.email;
    existingUser.selectedTemplate = req.body.selectedTemplate;
    existingUser.phone = req.body.phone || '';
    existingUser.location = req.body.location || '';
    existingUser.linkedin = req.body.linkedin || '';
    existingUser.github = req.body.github || '';
    existingUser.portfolio = req.body.portfolio || '';
    await existingUser.save();
    const safeUser = await User_1.default.findById(req.user?.id).select('-password');
    res.json((0, api_1.success)(safeUser, 'Profile updated successfully'));
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    const user = await User_1.default.findById(req.user?.id);
    if (!user)
        return res.status(404).json((0, api_1.fail)('User not found'));
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
        return res.status(400).json((0, api_1.fail)('Current password is incorrect'));
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json((0, api_1.success)(null, 'Password changed successfully'));
};
exports.changePassword = changePassword;
