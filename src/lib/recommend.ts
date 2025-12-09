import User, { IUser } from "@/models/User";
import Song from "@/models/Song";

export async function getRecommendations(userId: string) {
  // 🔥 Garantir retorno único e tipado
  const user = await User.findById(userId).lean<IUser>();

  if (!user) return [];

  const genres = user.favoriteGenres ?? [];

  // Se não tiver gênero favorito → músicas aleatórias
  if (!genres.length) {
    return Song.find().limit(10).lean();
  }

  // 🔥 Recomenda músicas dos gêneros favoritos
  return Song.find({
    genres: { $in: genres },
  })
    .limit(20)
    .lean();
}
