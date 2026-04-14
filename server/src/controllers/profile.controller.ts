import { Request, Response } from 'express';
import User from '../models/User';
import { fail, success } from '../utils/api';

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select('-password');
  if (!user) return res.status(404).json(fail('User not found'));
  res.json(success(user, 'Profile fetched successfully'));
};

export const updateProfile = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.user?.id);
  if (!existingUser) return res.status(404).json(fail('User not found'));

  const emailOwner = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user?.id },
  });

  if (emailOwner) {
    return res.status(409).json(fail('Email is already in use'));
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

  const safeUser = await User.findById(req.user?.id).select('-password');
  res.json(success(safeUser, 'Profile updated successfully'));
};

export const changePassword = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) return res.status(404).json(fail('User not found'));

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(400).json(fail('Current password is incorrect'));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json(success(null, 'Password changed successfully'));
};