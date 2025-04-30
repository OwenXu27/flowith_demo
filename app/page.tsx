'use client';

import AppLayout from '../components/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <div className="h-full bg-white">
        {/* Canvas content will go here */}
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Canvas Area</h2>
          <p className="text-gray-500">Your infinite canvas will be here</p>
        </div>
      </div>
    </AppLayout>
  );
}
