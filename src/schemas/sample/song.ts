import { z } from 'zod';

// 曲情報のバリデーションスキーマ
export const songSchema = z.object({
  id: z.string().min(1, { message: 'IDは必須です' }),
  title: z.string().min(1, { message: '曲名は必須です' }),
  artist: z.string().min(1, { message: 'アーティスト名は必須です' }),
  releaseDate: z.string().datetime({ message: '有効な日付を入力してください' }).optional(),
  duration: z.number().min(0, { message: '再生時間は0以上である必要があります' }).optional(),
  genre: z.string().optional(),
});

// 曲の追加リクエストのスキーマ
export const addSongSchema = songSchema.omit({ id: true });

// 曲の更新リクエストのスキーマ
export const updateSongSchema = songSchema.partial().extend({
  id: z.string().min(1, { message: 'IDは必須です' }),
});

// 曲の検索クエリのスキーマ
export const songSearchSchema = z.object({
  query: z.string().min(1, { message: '検索キーワードを入力してください' }),
  genre: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// TypeScriptの型を生成
export type Song = z.infer<typeof songSchema>;
export type AddSongRequest = z.infer<typeof addSongSchema>;
export type UpdateSongRequest = z.infer<typeof updateSongSchema>;
export type SongSearchParams = z.infer<typeof songSearchSchema>;
