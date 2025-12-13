import apiClient from '../client';
import { InsuranceBracket, CreateInsuranceBracketDto, UpdateInsuranceBracketDto } from './types';

const BASE_URL = '/payroll-configuration/insurance-brackets';

export const getInsuranceBrackets = async (params?: { status?: string }): Promise<InsuranceBracket[]> => {
  const response = await apiClient.get(BASE_URL, { params });
  return response.data;
};

export const getInsuranceBracketById = async (id: string): Promise<InsuranceBracket> => {
  const response = await apiClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createInsuranceBracket = async (data: CreateInsuranceBracketDto): Promise<InsuranceBracket> => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

export const updateInsuranceBracket = async (id: string, data: UpdateInsuranceBracketDto): Promise<InsuranceBracket> => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteInsuranceBracket = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};