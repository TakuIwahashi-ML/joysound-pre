import { z } from 'zod';

// 🎵 **楽曲関連スキーマ**
export const songSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, '楽曲名は必須です'),
  artist: z.string().min(1, 'アーティスト名は必須です'),
  genre: z.string().optional(),
  duration: z.number().min(0).optional(),
  releaseYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

// 👤 **ユーザー関連スキーマ**
export const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(3, 'ユーザー名は3文字以上です').max(20),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(13, '13歳以上である必要があります').max(120).optional(),
  favoriteGenres: z.array(z.string()).optional(),
});

// 🎤 **カラオケセッション関連スキーマ**
export const karaokeSessionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  songId: z.string().min(1),
  score: z.number().min(0).max(100),
  singDate: z.string().datetime(),
  roomType: z.enum(['individual', 'group', 'party']),
});

// 📝 **プレイリスト関連スキーマ**
export const playlistSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'プレイリスト名は必須です').max(50),
  userId: z.string().min(1),
  songs: z.array(z.string()), // songIdの配列
  isPublic: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

// 🔍 **検索関連スキーマ**
export const searchSchema = z.object({
  query: z.string().min(1, '検索キーワードを入力してください'),
  type: z.enum(['song', 'artist', 'album', 'playlist']).default('song'),
  genre: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['relevance', 'popularity', 'release_date', 'title']).default('relevance'),
});

// 📊 **ランキング関連スキーマ**
export const rankingSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('weekly'),
  category: z.enum(['overall', 'genre', 'age_group', 'region']).default('overall'),
  genre: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

// TypeScript型を生成
export type Song = z.infer<typeof songSchema>;
export type User = z.infer<typeof userSchema>;
export type KaraokeSession = z.infer<typeof karaokeSessionSchema>;
export type Playlist = z.infer<typeof playlistSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type RankingParams = z.infer<typeof rankingSchema>;

// フォーム用スキーマ（IDなし）
export const createSongSchema = songSchema.omit({ id: true });
export const createUserSchema = userSchema.omit({ id: true });
export const createPlaylistSchema = playlistSchema.omit({ id: true, createdAt: true });

// 更新用スキーマ（部分更新可能）
export const updateSongSchema = songSchema.partial().extend({ id: z.string().min(1) });
export const updateUserSchema = userSchema.partial().extend({ id: z.string().min(1) });
export const updatePlaylistSchema = playlistSchema.partial().extend({ id: z.string().min(1) });
