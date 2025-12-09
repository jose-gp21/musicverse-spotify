import Song from "@/models/Song";
import User from "@/models/User";

export async function recommendForUser(userId: string) {
  const user = await User.findById(userId).lean();
  if (!user) return [];

  const genres = user.favoriteGenres ?? [];

  if (!genres.length) {
    return Song.find().limit(10).lean();
  }

  return Song.find({
    genres: { $in: genres }
  })
    .limit(20)
    .lean();
}
