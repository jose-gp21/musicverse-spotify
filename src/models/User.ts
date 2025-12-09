import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  favoriteGenres: string[];
  favoriteSongs: string[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteGenres: [{ type: String }],
  favoriteSongs: [{ type: String }],
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
