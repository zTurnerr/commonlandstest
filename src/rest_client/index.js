import { updateBackendServer as updateFromApiClient } from './apiClient';
import { updateBackendServer as updateFromAuthClient } from './authClient';
import { retrieveBackendServer } from './authClient';

export const updateChangeBackendServer = (url) => {
    updateFromApiClient(url);
    updateFromAuthClient(url);
};

export const getBackendServer = () => {
    return retrieveBackendServer();
};
