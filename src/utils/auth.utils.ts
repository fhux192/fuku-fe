// ============================================================================
// src/utils/auth.utils.ts
// ============================================================================

export interface DecodedToken {
    id: number;
    name: string;
    sub: string;
    iat: number;
    exp: number;
    avatar?: string;
}

export const decodeJWT = (token: string): DecodedToken | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const getUserFromToken = (): { name: string; email: string; userId: number | null; avatar: string } | null => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        const decoded = decodeJWT(token);
        if (!decoded) return null;
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('authToken');
            return null;
        }
        const cachedAvatar = localStorage.getItem(`userAvatar_${decoded.sub}`);
        return {
            name: decoded.name || 'Người dùng',
            email: decoded.sub || '',
            userId: decoded.id || null,
            avatar: cachedAvatar || decoded.avatar || ""
        };
    } catch (error) {
        console.error('Failed to get user from token:', error);
        return null;
    }
};