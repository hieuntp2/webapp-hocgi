'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { checkInService } from '@/services/api';
import { progressService, UserStatus } from '@/services/api/progress';
import Image from 'next/image';
import Scanner from '@/components/qrScanner';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useApp();
  const { user, progress } = state;
  const [luckyNumber, setLuckyNumber] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [, setScanStatus] = useState(0);
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user status and lucky number from API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user status
        const statusResponse = await progressService.getUserStatus();
        if (statusResponse.success && statusResponse.data) {
          setUserStatus(statusResponse.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch user status:', error);
        // Check for 401 error
        if (error?.response?.status === 401 || error?.status === 401) {
          const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL;
          const returnUrl = process.env.NEXT_PUBLIC_SSO_RETURN_URL;
          window.location.href = `${ssoUrl}?returnUrl=${encodeURIComponent(returnUrl || '')}`;
          return;
        }
      }

      try {
        // Fetch lucky number
        const response = await checkInService.getCurrentUserCheckIn();
        if (response.success && response.data?.order != null) {
          setLuckyNumber(String(response.data.order).padStart(4, '0'));
        }
      } catch (error: any) {
        console.error('Failed to fetch lucky number:', error);
        // Check for 401 error
        if (error?.response?.status === 401 || error?.status === 401) {
          const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL;
          const returnUrl = process.env.NEXT_PUBLIC_SSO_RETURN_URL;
          window.location.href = `${ssoUrl}?returnUrl=${encodeURIComponent(returnUrl || '')}`;
          return;
        }
        // Fallback: generate from user id if available
        if (user?.luckyNumber) {
          setLuckyNumber(user.luckyNumber);
        } else if (user?.id) {
          const hash = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          setLuckyNumber(String(hash % 10000).padStart(4, '0'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchUserData();
    }
  }, [state.isAuthenticated, user?.id, user?.luckyNumber]);

  // Handle QR scan result
  useEffect(() => {
    const handleScanResult = async () => {
      if (!scanResult) return;

      try {
        setIsLoading(true);
        setShowScanner(false);
        
        // Parse QR URL to get roomType and deskId
        const url = new URL(scanResult);
        const roomType = parseInt(url.searchParams.get('roomId') || '0');
        const deskId = url.searchParams.get('tableId') || '';

        if (!roomType) {
          alert('QR code không hợp lệ');
          setScanResult(null);
          setIsLoading(false);
          return;
        }

        // Call check-in API
        const response = await checkInService.postUserCheckIn({
          roomType,
          deskId: deskId || undefined,
        });

        if (response.success && response.data) {
          // Show success message based on roomType
          let message = '';
          switch (response.data.roomType) {
            case 4:
              message = `Đã quét mã QR trường: ${response.data.universityName}`;
              break;
            case 3:
              message = 'Đã check-in phòng Hướng Nghiệp';
              break;
            case 2:
              message = 'Đã check-in phòng Tư vấn tâm lý';
              break;
            case 5:
              message = 'Đã quét mã Check-out';
              break;
            default:
              message = 'Check-in thành công!';
          }

          setSuccessMessage(message);
          setShowSuccessMessage(true);
          
          // Refresh user status
          const statusResponse = await progressService.getUserStatus();
          if (statusResponse.success && statusResponse.data) {
            setUserStatus(statusResponse.data);
          }

          // Hide success message after 3 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        }

        setScanResult(null);
      } catch (error: any) {
        console.error('Check-in failed:', error);
        alert('Có lỗi xảy ra khi check-in. Vui lòng thử lại.');
        setScanResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    handleScanResult();
  }, [scanResult]);

  // Calculate completed tasks based on user status from API
  const completedTasks = [
    userStatus?.checkStep1 || false,
    userStatus?.checkStep2 || false,
    userStatus?.checkStep3 || false,
  ].filter(Boolean).length;

  // Check if all 3 steps are completed
  const allStepsCompleted = completedTasks === 3;

  const progressItems = [
    {
      id: 'career',
      title: 'CHỌN NGHỀ',
      description: 'Làm bài test tính cách ONET',
      path: '/career',
      completed: userStatus?.checkStep1 || false,
      disabled: false,
    },
    {
      id: 'major',
      title: 'CHỌN NGÀNH',
      description: 'Tư vấn ngành học phù hợp',
      path: '/major',
      completed: userStatus?.checkStep2 || false,
      disabled: false,
    },
    {
      id: 'school',
      title: 'CHỌN TRƯỜNG',
      description: 'Gặp đại sứ sinh viên các trường',
      path: '/school',
      completed: userStatus?.checkStep3 || false,
      disabled: false,
    },
    {
      id: 'checkout',
      title: 'CHECK OUT',
      description: 'Hoàn thành và nhận quà',
      path: '/finish',
      completed: userStatus?.isCheckOut || false,
      disabled: !allStepsCompleted,
    },
  ];

  const handleItemClick = (item: typeof progressItems[0]) => {
    if (item.disabled) {
      alert('Bạn cần hoàn thành 3 bước trên.');
      return;
    }
    
    // Special handling for school selection
    if (item.id === 'school') {
      setShowSchoolDialog(true);
      return;
    }
    
    router.push(item.path);
  };

  const utilityItems = [
    {
      id: 'psychology',
      title: 'Tham vấn tâm lý',
      path: '/psychology',
      icon: (
        <svg className="w-8 h-8 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      bgColor: 'bg-accent-lighter',
    },
    {
      id: 'feedback',
      title: 'Góp ý chương trình',
      path: 'https://docs.google.com/forms/d/e/1FAIpQLScDRIOJOXcTHIIX8a__-HTZFHKosYy7mE4cYUBff2Y85YaVDw/viewform?fbclid=IwY2xjawP2JxRleHRuA2FlbQIxMABicmlkETFYZ2JjWW5TUVY5UjRiN0NMc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHsPk7GRVeX9kEhHDjNgvFEyKZvjLdl2oOOZENZEDQI5q7tnaNLTMu_-OlKSL_aem_bbFP3PCI18MfTnDQJ13M6A',
      external: true,
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      bgColor: 'bg-primary-lighter',
    },
    {
      id: 'food',
      title: 'Khu ẩm thực',
      path: '/utilities/food',
      icon: (
        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-accent-lighter',
    },
    {
      id: 'games',
      title: 'Khu trò chơi',
      path: '/utilities/games',
      icon: (
        <svg className="w-8 h-8 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-primary-lighter',
    },
    {
      id: 'music',
      title: 'Khu âm nhạc',
      path: '/utilities/music',
      icon: (
        <svg className="w-8 h-8 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      bgColor: 'bg-accent-lighter',
    },
    {
      id: 'locations',
      title: 'Bản đồ',
      path: '/locations',
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bgColor: 'bg-primary-lighter',
    },
  ];

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  return (
    <div className="min-h-screen relative">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-secondary/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              {/* Spinner */}
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-600 font-medium">Đang tải...</p>
          </div>
        </div>
      )}

      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay with warm tint */}
      <div className="fixed inset-0 z-0 bg-background-secondary/80" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-background-primary/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Image src="/logo-tvts.png" alt="TVTS Logo" width={200} height={200} className="object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScanner((prev) => !prev)}
            className="p-2 text-primary hover:bg-primary-lighter rounded-full transition-colors duration-base"
            aria-pressed={showScanner}
            aria-label={showScanner ? 'Đóng quét QR' : 'Mở quét QR'}
            title={showScanner ? 'Đóng quét QR' : 'Mở quét QR'}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a3 3 0 013-3h2m6 0h2a3 3 0 013 3v2m0 6v2a3 3 0 01-3 3h-2m-6 0H7a3 3 0 01-3-3v-2m0-6V7m6 4h4m-2-2v4" />
            </svg>
          </button>
          <button onClick={() => router.push('/profile')} className="p-2 text-primary hover:bg-primary-lighter rounded-full transition-colors duration-base">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {showScanner && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0">
            <Scanner
              scanner={showScanner}
              setShowScanner={setShowScanner}
              setScanStatus={setScanStatus}
              onScanSuccess={(result: string) => setScanResult(result)}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowScanner(false)}
            className="absolute top-4 right-4 z-10 bg-white/90 text-neutral-900 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] animate-bounce">
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Thành công!</h3>
                <p className="text-sm text-white/90">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* School Dialog */}
      {showSchoolDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSchoolDialog(false)}
          />
          <div className="relative bg-background-primary rounded-3xl p-6 shadow-2xl max-w-sm w-full transform transition-all">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-neutral-900 text-center mb-2 font-heading">
              Chọn Trường
            </h3>
            <p className="text-neutral-600 text-center mb-6 leading-relaxed">
              Gặp Đại sứ sinh viên & quét mã QR của trường để hoàn thành bước này
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSchoolDialog(false);
                  setShowScanner(true);
                }}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 px-6 rounded-xl shadow-md active:scale-95 transition-all duration-base hover:shadow-lg"
              >
                Mở máy quét QR
              </button>
              <button
                onClick={() => setShowSchoolDialog(false)}
                className="w-full bg-neutral-100 text-neutral-700 font-semibold py-3 px-6 rounded-xl active:scale-95 transition-all duration-base hover:bg-neutral-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 pb-6">
        {/* Welcome Section */}
        <div className="mt-4 bg-background-primary rounded-2xl p-4 shadow-card border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center text-white font-bold text-lg shadow-warm">
              {(user?.name || 'N')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-heading">
                Chào {user?.name || 'Nguyễn Văn A'}!
              </h2>
              <p className="text-sm text-neutral-500">Học sinh</p>
            </div>
          </div>

          {/* QR Scanner Button */}
          <button
            onClick={() => setShowScanner(true)}
            className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 px-4 rounded-xl shadow-md active:scale-95 transition-all duration-base hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a3 3 0 013-3h2m6 0h2a3 3 0 013 3v2m0 6v2a3 3 0 01-3 3h-2m-6 0H7a3 3 0 01-3-3v-2m0-6V7m6 4h4m-2-2v4" />
            </svg>
            <span>Quét mã QR</span>
          </button>

        </div>

        {/* Progress Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-neutral-900 tracking-wider font-heading">TIẾN ĐỘ HOÀN THÀNH</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-base ${i < completedTasks ? 'bg-gradient-to-r from-primary to-accent' : 'bg-neutral-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500">{completedTasks}/3</span>
            </div>
          </div>

          <div className="space-y-3">
            {progressItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full bg-background-primary rounded-2xl p-4 shadow-card border flex items-center gap-4 transition-all duration-base text-left ${
                  item.disabled
                    ? 'border-neutral-200 opacity-60 cursor-not-allowed'
                    : 'border-neutral-100 active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* Checkmark Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-base ${
                  item.completed 
                    ? 'bg-success shadow-md' 
                    : item.disabled
                    ? 'bg-neutral-200'
                    : 'bg-neutral-100'
                }`}>
                  <svg 
                    className={`w-5 h-5 ${
                      item.completed 
                        ? 'text-white' 
                        : item.disabled
                        ? 'text-neutral-400'
                        : 'text-neutral-300'
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold ${item.disabled ? 'text-neutral-400' : 'text-neutral-900'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm truncate ${item.disabled ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <svg 
                  className={`w-5 h-5 shrink-0 ${item.disabled ? 'text-neutral-300' : 'text-neutral-400'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Utilities Section */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-neutral-900 tracking-wider mb-3 font-heading">TIỆN ÍCH KHÁC</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {utilityItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.external) {
                    window.location.href = item.path;
                    return;
                  }
                  router.push(item.path);
                }}
                className={`${item.bgColor} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all duration-base min-h-[100px] shadow-sm hover:shadow-md border border-transparent hover:border-accent-light`}
              >
                {item.icon}
                <span className="text-sm font-medium text-neutral-700 text-center">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
