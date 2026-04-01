import React from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string;
}

export function LoadingSpinner({ fullPage = true, message = "正在为您加载数据..." }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* 外圈静止作为底色 */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-50"></div>
        {/* 内圈旋转作为动效 */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-500 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-300">
        {content}
      </div>
    );
  }

  return content;
}
