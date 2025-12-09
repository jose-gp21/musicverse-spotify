import { Schema, model, models } from "mongoose";

const BandSchema = new Schema(
  {
    name: { type: String, required: true },
    genres: [{ type: String }]
  },
  { timestamps: true }
);

const Band = models.Band || model("Band", BandSchema);
export default Band;
