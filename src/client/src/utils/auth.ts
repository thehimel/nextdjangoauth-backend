import secureLocalStorage from 'react-secure-storage';
import secureSessionStorage from 'react-secure-storage';

interface AuthProps {
  token: string;
  rememberMe: boolean;
}

const AUTH_TOKEN = 'authToken';

export const setAuthToken = ({ token, rememberMe }: AuthProps) => {
  if (rememberMe) {
    secureLocalStorage.setItem(AUTH_TOKEN, token);
  } else {
    secureSessionStorage.setItem(AUTH_TOKEN, token);
  }
};

export const getAuthToken = (): string | null => {
  return (secureLocalStorage.getItem(AUTH_TOKEN) || secureSessionStorage.getItem(AUTH_TOKEN)) as string | null;
};

export const clearAuthToken = () => {
  secureLocalStorage.removeItem(AUTH_TOKEN);
  secureSessionStorage.removeItem(AUTH_TOKEN);
};
