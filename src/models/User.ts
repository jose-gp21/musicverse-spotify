import { Schema, model, models, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    favoriteGenres: [{ type: String }],
    favoriteSongs: [{ type: Types.ObjectId, ref: "Song" }]
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
