'use client';
import React from 'react';
import { useGetPostsQuery } from '@/store/services/sample/sampleApi';

const GetSampleDataComponent = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  if (isLoading) {
    return <div className="p-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラーが発生しました</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">JSONPlaceholder（クライアントAPI） サンプルデータ</h2>
      <p className="mb-4">投稿データを表示しています（最初の3件）</p>

      <div className="space-y-4">
        {posts?.slice(0, 3).map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              {post.id}. {post.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">ユーザーID: {post.userId}</p>
            <p className="text-gray-800">{post.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">総投稿数: {posts?.length || 0}件</div>
    </div>
  );
};

export default GetSampleDataComponent;
