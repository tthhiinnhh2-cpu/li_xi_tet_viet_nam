'use client';

import dynamic from 'next/dynamic';

// Dynamic import với ssr: false → component chỉ render ở client
// → Giải quyết triệt để lỗi React Hydration Mismatch
const LixiGame = dynamic(() => import('@/components/LixiGame'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-red-600 flex items-center justify-center text-yellow-400 font-bold text-xl">
      Đang tải...
    </div>
  ),
});

export default function Page() {
  return <LixiGame />;
}
