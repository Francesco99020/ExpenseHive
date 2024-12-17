import mongoose, { Schema } from 'mongoose';

interface User extends Document{
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema: Schema = new Schema({
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const UserModel = mongoose.model<User>('user', userSchema);

export default UserModel;