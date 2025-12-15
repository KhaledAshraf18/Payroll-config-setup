import { PayType } from './types';
import api from '../client';

// Helper function to extract user name from user object
const extractUserName = (user: any): string => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.fullName) return user.fullName;
  if (user.email) return user.email;
  if (user.employeeNumber) return user.employeeNumber;
  return user._id || user.id || '';
};

// Helper function to normalize status (handle case differences)
const normalizeStatus = (status: any): 'draft' | 'approved' | 'rejected' => {
  if (!status) return 'draft';
  const statusStr = String(status).toLowerCase();
  if (statusStr === 'approved') return 'approved';
  if (statusStr === 'rejected') return 'rejected';
  return 'draft'; // Default to draft
};

// Helper function to map backend response to frontend type
const mapBackendToFrontend = (backendData: any): PayType & { _amount?: number } => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.name ?? backendData.type ?? '',
    description: backendData.description ?? '',
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    type: (backendData.type as 'hourly' | 'salary' | 'commission' | 'contract') ?? 'salary',
    calculationMethod: backendData.calculationMethod ?? '',
    isTaxable: backendData.isTaxable !== undefined ? backendData.isTaxable : true,
    isOvertimeEligible: backendData.isOvertimeEligible ?? false,
    overtimeRate: backendData.overtimeRate,
    minHours: backendData.minHours,
    maxHours: backendData.maxHours,
    _amount: backendData.amount, // Store amount for updates
  } as PayType & { _amount?: number };
};

// Helper function to map frontend type to backend DTO
// Backend DTO ONLY accepts: type, amount
const mapFrontendToBackend = (frontendData: any) => {
  return {
    type: String(frontendData.type || 'salary').trim(),
    amount: parseFloat(String(frontendData.amount || 0)),
  };
};

export const payTypesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayType[]> => {
    try {
      const response = await api.get('/payroll-configuration/pay-types');
      let payTypes: any[] = [];
      if (Array.isArray(response)) {
        payTypes = response;
      } else if (response && typeof response === 'object') {
        if ('data' in response) {
          const data = (response as any).data;
          payTypes = Array.isArray(data) ? data : (data?.items && Array.isArray(data.items) ? data.items : []);
        } else if ('items' in response && Array.isArray((response as any).items)) {
          payTypes = (response as any).items;
        }
      }
      
      // Map each item from backend to frontend format
      payTypes = payTypes.map(mapBackendToFrontend);
      
      // Filter by status if provided
      if (status) {
        payTypes = payTypes.filter((item: PayType) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return payTypes;
    } catch (error) {
      console.error('Error fetching pay types:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PayType> => {
    try {
      const response = await api.get(`/payroll-configuration/pay-types/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching pay type ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<PayType, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy'>): Promise<PayType> => {
    try {
      // Backend DTO ONLY accepts: type, amount
      const type = String(data.type || 'salary').trim();
      const amount = parseFloat(String(data.amount || 0));
      
      // Validate required fields
      if (!type) {
        throw new Error('Pay type is required');
      }
      if (isNaN(amount) || amount < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      const backendData = {
        type: type,
        amount: Number(amount),
      };
      
      const response = await api.post('/payroll-configuration/pay-types', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating pay type:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<PayType & { amount?: number }>): Promise<PayType> => {
    try {
      // Backend only accepts 'type' and 'amount' for updates
      // Other fields (name, description, calculationMethod, etc.) are not accepted by the running backend
      const backendData: any = {};
      
      if (data.type !== undefined) backendData.type = data.type;
      if (data.amount !== undefined) backendData.amount = parseFloat(String(data.amount));
      
      // Validate amount if provided
      if (backendData.amount !== undefined && backendData.amount < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      const response = await api.put(`/payroll-configuration/pay-types/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating pay type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/pay-types/${id}`);
    } catch (error) {
      console.error(`Error deleting pay type ${id}:`, error);
      throw error;
    }
  }
};
