import { apiClient } from './client';
import type { ApiResponse } from '@/types';

export interface CheckInRecord {
  userId: string;
  roomType: number;
  deskId: string;
  created: string;
}

export interface UserCheckInInfo {
  order: number;
  checkIns: CheckInRecord[];
}

export interface CheckInInput {
  roomType?: number;
  deskId?: string;
}

export interface UserOfflineInforInput {
  psychologicalQuestions: string;
}

export interface CustomFieldInput {
  customFieldIds: string;
  customJob: string;
}

export interface CustomMajorInput {
  customMajor: string;
}

export interface UserCustomFieldsModel {
  customFieldIds: string;
  customJob: string;
  customMajor: string;
}

export const checkInService = {
  // Get current user's check-in info
  async getCurrentUserCheckIn(): Promise<ApiResponse<UserCheckInInfo>> {
    return apiClient.get('/UserCheckIn/current-user');
  },

  // Get psychological questions - returns JSON string directly
  async getPsychologicalQuestions(): Promise<ApiResponse<string>> {
    return apiClient.get('/UserCheckIn/offline-infor/psychological-questions');
  },

  // Post user check-in
  async postUserCheckIn(data: CheckInInput): Promise<ApiResponse<UserCheckInInfo>> {
    return apiClient.post('/UserCheckIn/post-user-checkin', data as unknown as Record<string, unknown>);
  },

  // Post offline information (psychology questions)
  async postOfflineInfor(data: UserOfflineInforInput): Promise<ApiResponse<null>> {
    return apiClient.patch('/UserCheckIn/offline-infor', data as unknown as Record<string, unknown>);
  },

  // Get custom fields
  async getCustomFields(): Promise<ApiResponse<UserCustomFieldsModel>> {
    return apiClient.get('/UserCheckIn/offline-infor/custom-fields');
  },

  // Set custom field and job
  async setCustomField(data: CustomFieldInput): Promise<ApiResponse<null>> {
    return apiClient.patch('/UserCheckIn/offline-infor/set-custom-field', data as unknown as Record<string, unknown>);
  },

  // Set custom major
  async setCustomMajor(data: CustomMajorInput): Promise<ApiResponse<null>> {
    return apiClient.patch('/UserCheckIn/offline-infor/set-custom-major', data as unknown as Record<string, unknown>);
  },

  // Get checkout status
  async getIsCheckout(): Promise<ApiResponse<{ isCheckout: boolean }>> {
    return apiClient.get('/UserCheckIn/offline-infor/is-checkout');
  },

  // Post checkout
  async postCheckout(): Promise<ApiResponse<null>> {
    return apiClient.patch('/UserCheckIn/offline-infor/checkout');
  },
};
