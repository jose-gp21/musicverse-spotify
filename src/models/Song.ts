import { Schema, model, models, Types } from "mongoose";

const SongSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    bandId: { type: Types.ObjectId, ref: "Band" },
    genres: [{ type: String }],
    previewUrl: { type: String } // prévia do Spotify
  },
  { timestamps: true }
);

const Song = models.Song || model("Song", SongSchema);
export default Song;
