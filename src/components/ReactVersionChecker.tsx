'use client';

import React from 'react';

export default function ReactVersionChecker() {
  // React 19の新機能をテスト
  const [count, setCount] = React.useState(0);

  // React 19で導入されたuse()フックが使用可能かチェック
  const hasReact19Features = typeof React.use === 'function';

  // React.versionを確認（開発環境でのみ利用可能）
  const reactVersion = React.version;

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">React Version Checker</h2>

      <div className="space-y-2">
        <p>
          <strong>React Version:</strong> {reactVersion}
        </p>
        <p>
          <strong>React 19 Features Available:</strong> {hasReact19Features ? '✅ Yes' : '❌ No'}
        </p>

        {/* React 19の新しいAction機能のテスト */}
        <div className="mt-4">
          <p>
            <strong>Counter (React 19 State):</strong> {count}
          </p>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment
          </button>
        </div>

        {/* React 19のuseOptimistic()が利用可能かチェック */}
        <p>
          <strong>useOptimistic available:</strong>{' '}
          {typeof React.useOptimistic === 'function' ? '✅ Yes' : '❌ No'}
        </p>

        {/* React 19のuseActionState()が利用可能かチェック */}
        <p>
          <strong>useActionState available:</strong>{' '}
          {typeof React.useActionState === 'function' ? '✅ Yes' : '❌ No'}
        </p>
      </div>
    </div>
  );
}
