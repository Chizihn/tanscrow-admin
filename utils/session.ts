import Cookies from "js-cookie";

// Custom storage object for cookies
export const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = Cookies.get(name);
      return value || null;
    } catch (error) {
      console.warn(`Error reading cookie ${name}:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string, options = {}): void => {
    try {
      Cookies.set(name, value, {
        ...options,
        expires: 2,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        path: "/", // Ensure cookie is available everywhere
      });
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
    }
  },
  removeItem: (name: string): void => {
    Cookies.remove(name, { path: "/" }); // Ensure cookie is removed from all paths
  },
};

export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

// utils/session.ts
export function getAccessToken(): string {
  return cookieStorage.getItem("accessToken") || "";
}

export function setAccessToken(token: string) {
  cookieStorage.setItem("accessToken", token);
}

export function removeAccessToken() {
  cookieStorage.removeItem("accessToken");
}

export function getRefreshToken(): string {
  return cookieStorage.getItem("refreshToken") || "";
}

export function setRefreshToken(token: string) {
  cookieStorage.setItem("refreshToken", token);
}

export function removeRefreshToken() {
  cookieStorage.removeItem("refreshToken");
}

// For backward compatibility
export function getToken(): string {
  return getAccessToken();
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    return tokenPayload.exp * 1000 < Date.now();
  } catch {
    return true; // Malformed token = treat as expired
  }
};
