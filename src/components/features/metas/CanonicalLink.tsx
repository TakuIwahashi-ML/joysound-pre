import { getCanonicalUrl } from '@/lib/canonical';

interface CanonicalLinkProps {
  fallbackPath?: string;
}

/**
 * canonical URLを設定するコンポーネント
 * middlewareで設定されたcanonical URLを取得し、headに設定する
 */
export default async function CanonicalLink({ fallbackPath }: CanonicalLinkProps) {
  const canonicalUrl = await getCanonicalUrl();

  return <link rel="canonical" href={canonicalUrl} />;
}
