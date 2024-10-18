import mongoose from 'mongoose';

import { UserRole } from '../enum/user-role.enum';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  active: boolean;
  banned: boolean;
  userRole: UserRole;
  isPasswordUpdatedAfterJwtIssued(jwtTimestamp: number): boolean;
}

export interface UserModel extends mongoose.Model<UserDocument> {}

const userSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  passwordUpdatedAt: { type: Date, select: false },
  userRole: {
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.User,
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
