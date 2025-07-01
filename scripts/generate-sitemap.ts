#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { join } from 'path';
import { createSitemapGenerator } from '../src/lib/sitemap/generator';
import { createPageDetector, type DetectedPage } from '../src/lib/sitemap/page-detector';

async function generateSitemap() {
  console.log('🚀 サイトマップを生成中...');

  try {
    const sitemapGenerator = createSitemapGenerator();
    const sitemapXml = await sitemapGenerator.generateSitemap();

    // publicディレクトリに保存
    const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(outputPath, sitemapXml, 'utf-8');

    console.log(`✅ サイトマップが生成されました: ${outputPath}`);

    // 詳細な統計情報を表示
    const pageDetector = createPageDetector();
    const detectedPages = pageDetector.detectPages();

    console.log(`📊 検出されたページ数: ${detectedPages.length}`);
    console.log('');
    console.log('📋 検出されたページ一覧:');

    detectedPages.forEach((page: DetectedPage, index: number) => {
      console.log(
        `  ${index + 1}. ${page.path} (優先度: ${page.priority}, 更新頻度: ${page.changefreq})`
      );
    });

    console.log('');
    console.log('💡 ヒント: 新しいpage.tsxファイルを追加すると、自動的にサイトマップに含まれます');
  } catch (error) {
    console.error('❌ サイトマップの生成に失敗しました:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  generateSitemap();
}

export { generateSitemap };
