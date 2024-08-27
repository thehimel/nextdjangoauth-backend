import secureLocalStorage from 'react-secure-storage';
import secureSessionStorage from 'react-secure-storage';

interface AuthProps {
  token: string;
  rememberMe: boolean;
}

export const setAuthToken = ({ token, rememberMe }: AuthProps) => {
  if (rememberMe) {
    secureLocalStorage.setItem('authToken', token);
  } else {
    secureSessionStorage.setItem('authToken', token);
  }
};

export const getAuthToken = (): string | null => {
  return (secureLocalStorage.getItem('authToken') || secureSessionStorage.getItem('authToken')) as string | null;
};

export const clearAuthToken = () => {
  secureLocalStorage.removeItem('authToken');
  secureSessionStorage.removeItem('authToken');
};
