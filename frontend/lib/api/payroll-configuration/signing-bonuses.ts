import apiClient from '../client';
import { SigningBonus, CreateSigningBonusDto, UpdateSigningBonusDto } from './types';

const BASE_URL = '/payroll-configuration/signing-bonuses';

export const getSigningBonuses = async (params?: { status?: string }): Promise<SigningBonus[]> => {
  const response = await apiClient.get(BASE_URL, { params });
  return response.data;
};

export const getSigningBonusById = async (id: string): Promise<SigningBonus> => {
  const response = await apiClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createSigningBonus = async (data: CreateSigningBonusDto): Promise<SigningBonus> => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

export const updateSigningBonus = async (id: string, data: UpdateSigningBonusDto): Promise<SigningBonus> => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteSigningBonus = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};