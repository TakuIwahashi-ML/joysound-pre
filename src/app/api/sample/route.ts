// 仮のAPIエンドポイントの例（クライアント側で使用する）

import { NextResponse } from 'next/server';
import { z } from 'zod';

// 🎯 **このAPIで使用するスキーマを定義**
const songSchema = z.object({
  id: z.string().min(1, { message: 'IDは必須です' }),
  title: z.string().min(1, { message: '曲名は必須です' }),
  artist: z.string().min(1, { message: 'アーティスト名は必須です' }),
  releaseDate: z.string().datetime({ message: '有効な日付を入力してください' }).optional(),
  duration: z.number().min(0, { message: '再生時間は0以上である必要があります' }).optional(),
  genre: z.string().optional(),
});

// 楽曲追加用スキーマ（IDなし）
const addSongSchema = songSchema.omit({ id: true });

// 楽曲検索用スキーマ
const songSearchSchema = z.object({
  query: z.string().min(1, { message: '検索キーワードを入力してください' }),
  genre: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// TypeScript型を生成
type Song = z.infer<typeof songSchema>;
// type AddSongRequest = z.infer<typeof addSongSchema>;  // 未使用のため削除
// type SongSearchParams = z.infer<typeof songSearchSchema>;  // 未使用のため削除

// 🎵 **GET /api/sample - 楽曲検索**
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const genre = searchParams.get('genre');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 🛡️ クエリパラメータのバリデーション
    const validatedParams = songSearchSchema.parse({
      query,
      genre,
      page,
      limit,
    });

    // 🎯 実際のデータベース検索処理をここに実装
    // 現在は仮のデータを返す
    const mockSongs: Song[] = [
      {
        id: '1',
        title: '津軽海峡冬景色',
        artist: '石川さゆり',
        genre: '演歌',
        duration: 285,
      },
      {
        id: '2',
        title: '贈る言葉',
        artist: '海援隊',
        genre: 'フォーク',
        duration: 242,
      },
    ].filter(
      (song) =>
        song.title.includes(validatedParams.query) || song.artist.includes(validatedParams.query)
    );

    return NextResponse.json({
      items: mockSongs,
      total: mockSongs.length,
      page: validatedParams.page,
      limit: validatedParams.limit,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: '内部サーバーエラーが発生しました' }, { status: 500 });
  }
}

// 🎵 **POST /api/sample - 楽曲追加**
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🛡️ リクエストボディのバリデーション
    const validatedData = addSongSchema.parse(body);

    // 🎯 実際のデータベース保存処理をここに実装
    // 現在は仮のレスポンスを返す
    const newSong: Song = {
      id: `song-${Date.now()}`, // 仮のID生成
      ...validatedData,
    };

    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: '内部サーバーエラーが発生しました' }, { status: 500 });
  }
}
