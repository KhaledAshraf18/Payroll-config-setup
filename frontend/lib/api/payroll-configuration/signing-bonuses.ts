import api from '../client';
import { SigningBonus, CreateSigningBonusDto, UpdateSigningBonusDto } from './types';

const BASE_URL = '/payroll-configuration/signing-bonuses';

export const signingBonusesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<SigningBonus[]> => {
    try {
      const params = status ? { status } : undefined;
      const response = await api.get(BASE_URL, params ? { params } : {}) as any;
      // Response interceptor already extracts response.data, so response is already the data
      let bonuses = Array.isArray(response) ? response : (response?.items || response?.data || []);
      return bonuses;
    } catch (error) {
      console.error('Error fetching signing bonuses:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<SigningBonus> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`) as any;
      // Response interceptor already extracts response.data
      return response;
    } catch (error) {
      console.error(`Error fetching signing bonus ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateSigningBonusDto): Promise<SigningBonus> => {
    try {
      // Explicitly create payload with only allowed fields
      const payload = {
        positionName: String(data.positionName).trim(),
        amount: Number(data.amount),
      };
      console.log('API: Sending signing bonus payload:', payload);
      const response = await api.post(BASE_URL, payload) as any;
      // Response interceptor already extracts response.data
      return response;
    } catch (error) {
      console.error('Error creating signing bonus:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateSigningBonusDto): Promise<SigningBonus> => {
    try {
      // Explicitly create payload with only allowed fields
      const payload: any = {};
      if (data.positionName !== undefined) {
        payload.positionName = String(data.positionName).trim();
      }
      if (data.amount !== undefined) {
        payload.amount = Number(data.amount);
      }
      console.log('API: Sending signing bonus update payload:', payload);
      const response = await api.put(`${BASE_URL}/${id}`, payload) as any;
      // Response interceptor already extracts response.data
      return response;
    } catch (error) {
      console.error(`Error updating signing bonus ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting signing bonus ${id}:`, error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getSigningBonuses = signingBonusesApi.getAll;
export const getSigningBonusById = signingBonusesApi.getById;
export const createSigningBonus = signingBonusesApi.create;
export const updateSigningBonus = signingBonusesApi.update;
export const deleteSigningBonus = signingBonusesApi.delete;