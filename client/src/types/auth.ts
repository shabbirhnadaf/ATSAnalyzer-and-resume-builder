export interface User {
    id: string;
    name: string;
    email: string;
    selectedTemplate: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface meResponse {
    success: boolean;
    message: string;
    data: User;
}