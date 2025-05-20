// app/marketplace/[id]/metaverse/page.tsx or .jsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the scene component with SSR disabled
const MetaverseScene = dynamic(() => import('./MetaverseScene'), {
  ssr: false,
});

export default function Page({params}) {
  return (
    <div>
      <MetaverseScene params={params}/>
    </div>
  );
}
