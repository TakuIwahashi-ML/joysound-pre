// Kuroco CMS API Client
export interface KurocoApiResponse<T> {
  list: T[];
  pageInfo: {
    totalCnt: number;
    endFlg: boolean;
    pageNo: number;
    pageSize: number;
  };
}

export interface BlogPost {
  topics_id: number;
  subject: string;
  slug: string;
  update_ymdhi: string;
}

export interface Artist {
  artist_id: number;
  name: string;
  slug: string;
  update_ymdhi: string;
}

export interface Song {
  song_id: number;
  title: string;
  slug: string;
  update_ymdhi: string;
}

class KurocoClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.KUROCO_API_BASE_URL || '';
    this.apiKey = process.env.KUROCO_API_KEY || '';
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<KurocoApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-RCMS-API-ACCESS-TOKEN': this.apiKey,
        'Content-Type': 'application/json',
      },
      // Next.js 15のキャッシュ設定
      next: {
        revalidate: 3600, // 1時間キャッシュ
      },
    });

    if (!response.ok) {
      throw new Error(`Kuroco API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ブログ記事一覧を取得
  async getBlogPosts(params?: {
    pageNo?: number;
    pageSize?: number;
  }): Promise<KurocoApiResponse<BlogPost>> {
    return this.request<BlogPost>('/api/blogs', params);
  }

  // アーティスト一覧を取得
  async getArtists(params?: {
    pageNo?: number;
    pageSize?: number;
  }): Promise<KurocoApiResponse<Artist>> {
    return this.request<Artist>('/api/artists', params);
  }

  // 楽曲一覧を取得
  async getSongs(params?: {
    pageNo?: number;
    pageSize?: number;
  }): Promise<KurocoApiResponse<Song>> {
    return this.request<Song>('/api/songs', params);
  }

  // 全てのデータを取得（ページネーション対応）
  async getAllData<T>(
    fetchFunction: (params: { pageNo: number; pageSize: number }) => Promise<KurocoApiResponse<T>>,
    pageSize: number = 100
  ): Promise<T[]> {
    const allData: T[] = [];
    let pageNo = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchFunction({ pageNo, pageSize });
      allData.push(...response.list);
      hasMore = !response.pageInfo.endFlg;
      pageNo++;
    }

    return allData;
  }
}

export const kurocoClient = new KurocoClient();
