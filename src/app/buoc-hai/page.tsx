'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkInService } from '@/services/api/checkIn';


function CheckInHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performCheckIn = async () => {
      // Get roomId and tableId from URL parameters
      const roomId = searchParams.get('roomId');
      const tableId = searchParams.get('tableId');

      // Validate roomId
      if (!roomId) {
        router.push('/dashboard');
        return;
      }

      try {
        // Call check-in API
        const response = await checkInService.postUserCheckIn({
          roomType: Number(roomId),
          deskId: tableId || undefined,
        });

        // Display success message based on RoomType
        if (response.success && response.data) {
          const { roomType, universityName } = response.data;
          let successMessage = '';

          switch (roomType) {
            case 4:
              successMessage = `Đã quét mã QR trường: ${universityName}`;
              break;
            case 3:
              successMessage = 'Đã check-in phòng Hướng Nghiệp';
              break;
            case 2:
              successMessage = 'Đã check-in phòng Tư vấn tâm lý';
              break;
            case 5:
              successMessage = 'Đã quét mã Check-out';
              break;
            default:
              successMessage = 'Check-in thành công';
          }

          setMessage(successMessage);
          setIsLoading(false);

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        // Redirect to dashboard even on error
        router.push('/dashboard');
      }
    };

    performCheckIn();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý check-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 border-2 border-green-200">
        <div className="text-center">
          {/* Animated Green Checkmark */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 animate-bounce shadow-lg">
            <svg
              className="h-14 w-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-green-700 mb-4">Thành công!</h2>
          <p className="text-xl text-gray-800 font-medium mb-2">{message}</p>
          <p className="text-sm text-gray-500 mt-6">Đang chuyển về trang chủ...</p>
        </div>
      </div>
    </div>
  );
}

export default function BuocHaiPage() {
  return (
    <Suspense fallback={null}>
      <CheckInHandler />
    </Suspense>
  );
}