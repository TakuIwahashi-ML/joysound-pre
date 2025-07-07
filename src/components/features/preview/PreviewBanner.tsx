'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PreviewBanner() {
  const searchParams = useSearchParams();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const previewToken = searchParams.get('preview_token');
    setIsPreview(!!previewToken);
  }, [searchParams]);

  if (!isPreview) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
      <strong>🔍 プレビューモード</strong> - 下書きデータを表示中
    </div>
  );
}
