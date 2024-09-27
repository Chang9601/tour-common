import mongoose from 'mongoose';

import { UserRole } from '../enum/user-role.enum';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userRole: UserRole;
  isPasswordUpdatedAfterJwtIssued(jwtTimestamp: number): boolean;
}

export interface UserModel extends mongoose.Model<UserDocument> {}

const userSchema = new mongoose.Schema({
  passwordUpdatedAt: { type: Date, select: false },
  userRole: {
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.User,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    select: false,
  },
  deletedAt: {
    type: Date,
    select: false,
  },
});

userSchema.methods.isPasswordUpdatedAfterJwtIssued = function (
  jwtTimestamp: number
): boolean {
  if (this.passwordUpdatedAt) {
    const timestamp = parseInt(this.passwordUpdatedAt.getTime(), 10) / 1000;

    return jwtTimestamp < timestamp;
  }

  return false;
};

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
