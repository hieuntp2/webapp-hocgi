'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkInService } from '@/services/api/checkIn';


function CheckInHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
        await checkInService.postUserCheckIn({
          roomType: Number(roomId),
          deskId: tableId || undefined,
        });

        // Redirect to dashboard on success
        router.push('/dashboard');
      } catch (err) {
        // Redirect to dashboard even on error
        router.push('/dashboard');
      }
    };

    performCheckIn();
  }, [searchParams, router]);

  return null;
}

export default function BuocHaiPage() {
  return (
    <Suspense fallback={null}>
      <CheckInHandler />
    </Suspense>
  );
}