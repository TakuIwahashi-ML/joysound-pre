import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// JSONPlaceholder の型定義
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export const sampleApi = createApi({
  reducerPath: 'sampleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  tagTypes: ['Post', 'User', 'Todo', 'Comment'],
  endpoints: (builder) => ({
    // 📝 投稿一覧取得
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Post'],
    }),
    // 📝 特定の投稿取得
    getPost: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
    // 👥 ユーザー一覧取得
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    // 👤 特定のユーザー取得
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    // ✅ TODO一覧取得
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
      providesTags: ['Todo'],
    }),
    // ✅ ユーザー別TODO取得
    getUserTodos: builder.query<Todo[], number>({
      query: (userId) => `users/${userId}/todos`,
      providesTags: ['Todo'],
    }),
    // 💬 投稿のコメント取得
    getPostComments: builder.query<Comment[], number>({
      query: (postId) => `posts/${postId}/comments`,
      providesTags: ['Comment'],
    }),
    // 📝 投稿作成（テスト用）
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useGetTodosQuery,
  useGetUserTodosQuery,
  useGetPostCommentsQuery,
  useCreatePostMutation,
} = sampleApi;
