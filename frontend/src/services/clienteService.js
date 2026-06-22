import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

export const createCliente = async (data) => {
  const response = await api.post(API_ENDPOINTS.CLIENTE.CREATE, data);
  return response.data;
};

export const updateCliente = async (id, data) => {
  const endpoint = API_ENDPOINTS.CLIENTE.UPDATE.replace(':id', id);
  const response = await api.put(endpoint, data);
  return response.data;
};

export const getClienteById = async (id) => {
  const endpoint = API_ENDPOINTS.CLIENTE.GET.replace(':id', id);
  const response = await api.get(endpoint);
  return response.data;
};


export const checkCpfExists = async (cpf) => {
  const response = await api.get(API_ENDPOINTS.CLIENTE.LIST, {
    params: { cpf }
  });

  return response.data.length > 0;
};

export const deleteCliente = async (id) => {
  const endpoint = API_ENDPOINTS.CLIENTE.DELETE.replace(':id', id);
  const response = await api.delete(endpoint);
  return response.data;
};

export const getClientes = async () => {
  const response = await api.get(API_ENDPOINTS.CLIENTE.LIST);
  return response.data;
};