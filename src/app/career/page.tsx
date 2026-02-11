'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { checkInService } from '@/services/api/checkIn';
import type { UserSelectedCareersModel } from '@/services/api/checkIn';

export default function CareerPage() {
  const router = useRouter();
  const [careerData, setCareerData] = useState<UserSelectedCareersModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadSelectedCareers = async () => {
      try {
        const response = await checkInService.getSelectedCareers();
        if (response.success && response.data) {
          setCareerData(response.data);
        }
      } catch {
        // No data yet - that's ok
      } finally {
        setIsLoadingData(false);
      }
    };
    loadSelectedCareers();
  }, []);

  const handleNotSure = () => {
    const testUrl = process.env.NEXT_PUBLIC_TEST_URL || '';
    const returnUrl = process.env.NEXT_PUBLIC_SSO_RETURN_URL || '';

    window.location.href = `${testUrl}?returnUrl=${encodeURIComponent(returnUrl)}/dashboard`;
  };

  const hasAnyData = careerData && (
    careerData.customJob ||
    careerData.customFields?.length > 0 ||
    careerData.selectedMajors?.length > 0 ||
    careerData.fieldScores?.length > 0
  );

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header
        title="Chọn nghề"
        onBack={() => router.push('/dashboard')}
        showLogo
      />

      <div className="px-4 py-6">

        {/* Selected Careers Summary */}
        {isLoadingData ? (
          <div className="mb-6 p-4 rounded-2xl bg-background-primary border border-neutral-100 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-neutral-100 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
          </div>
        ) : (careerData && hasAnyData) ? (
          <div className="mb-6 rounded-2xl bg-background-primary border border-neutral-100 overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-neutral-800">Lựa chọn của bạn</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Custom Job */}
              {careerData.customJob && (
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Nghề yêu thích</p>
                  <p className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {careerData.customJob}
                  </p>
                </div>
              )}

              {/* Custom Fields */}
              {careerData.customFields?.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-1.5">Lĩnh vực đã chọn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {careerData.customFields.map((field) => (
                      <span
                        key={field.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                      >
                        {field.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Majors */}
              {careerData.selectedMajors?.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-1.5">Ngành học quan tâm</p>
                  <div className="flex flex-wrap gap-1.5">
                    {careerData.selectedMajors.map((major) => (
                      <span
                        key={major.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {major.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Scores */}
              {careerData.fieldScores?.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-1.5">Lĩnh vực phù hợp (từ bài test)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {careerData.fieldScores.map((field) => (
                      <span
                        key={field.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {field.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Question */}
        <h1 className="text-2xl font-bold text-center text-neutral-900 mb-3 font-heading">
          {hasAnyData ? (
            <>BẠN MUỐN CẬP NHẬT<br />LỰA CHỌN CỦA MÌNH?</>
          ) : (
            <>BẠN ĐÃ CHỌN ĐƯỢC NGHỀ<br />YÊU THÍCH CHƯA?</>
          )}
        </h1>
        <p className="text-center text-neutral-500 mb-8">
          {hasAnyData
            ? 'Bạn có thể thay đổi nghề nghiệp đã chọn hoặc tìm kiếm thêm gợi ý phù hợp'
            : 'Chúng tôi sẽ giúp bạn tìm kiếm định hướng phù hợp'
          }
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full !bg-success hover:!bg-success/90"
            onClick={() => router.push('/career/list')}
          >
            {hasAnyData ? 'CẬP NHẬT NGHỀ YÊU THÍCH' : 'RỒI, TÔI ĐÃ CHỌN NGHỀ'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleNotSure}
          >
            {hasAnyData ? 'TÌM KIẾM GỢI Ý KHÁC' : 'CHƯA, TÔI CHƯA BIẾT'}
          </Button>
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-accent-lighter rounded-xl border border-accent-light">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Gợi ý:</span> Nếu bạn chưa chắc chắn, hãy làm bài test ONET để khám phá năng lực và sở thích của bản thân!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
