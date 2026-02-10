'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { useAuthFromToken } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useApp();
  const { user } = useAuthFromToken();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    const ssoLogoutUrl = process.env.NEXT_PUBLIC_SSO_LOGOUT_URL;
    const returnUrl = process.env.NEXT_PUBLIC_SSO_RETURN_URL;
    
    console.log('SSO Logout URL:', ssoLogoutUrl);
    console.log('Return URL:', returnUrl);
    console.log('Full redirect:', `${ssoLogoutUrl}?returnUrl=${encodeURIComponent(returnUrl || '')}`);
    
    window.location.href = `${ssoLogoutUrl}?returnUrl=${encodeURIComponent(returnUrl || '')}`;
  };

  const handleTestHistory = () => {
    window.open('https://hocgi.vn/tu-van-tuyen-sinh/lich-su', '_blank');
  };

  const menuItems = [
    {
      id: 'test-history',
      title: 'Lịch sử trắc nghiệm',
      icon: (
        <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: handleTestHistory,
    },
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="Hồ sơ" onBack={() => router.push('/dashboard')} />
      
      <div className="px-4 py-6">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-warm">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-neutral-900 font-heading">{user?.name || 'Người dùng'}</h2>
                <p className="text-sm text-neutral-500">{user?.email || 'email@example.com'}</p>
                <p className="text-sm text-neutral-500">{user?.school || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 p-4 bg-background-primary rounded-xl shadow-card border border-neutral-100 active:scale-[0.98] transition-all duration-base hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="flex-1 text-left font-medium text-neutral-700">{item.title}</span>
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Social Links */}
        <Card className="mb-6">
          <CardContent>
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Theo dõi chúng tôi</h3>
            <div className="space-y-3">
              <a 
                href="https://www.facebook.com/tuvantuyensinhqt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Facebook</p>
                  <p className="text-xs text-neutral-500">@tuvantuyensinhqt</p>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://www.tiktok.com/@tvtsqt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/5 hover:bg-neutral-900/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">TikTok</p>
                  <p className="text-xs text-neutral-500">@tvtsqt</p>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://www.instagram.com/hocgi.vn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#F77737]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Instagram</p>
                  <p className="text-xs text-neutral-500">@hocgi.vn</p>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://hocgi.vn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">HocGi.vn</p>
                  <p className="text-xs text-neutral-500">Đọc review từ các Đại sứ sinh viên</p>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full mt-6 text-primary border-primary-light hover:bg-primary-lighter"
          onClick={() => setShowLogoutModal(true)}
        >
          Đăng xuất
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          TVTS Quảng Trị 2026 - Phiên bản 1.0.0
        </p>
      </div>

      {/* Logout Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <ModalHeader>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-lighter flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 font-heading">Đăng xuất?</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-neutral-600 text-center">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => setShowLogoutModal(false)}
          >
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
