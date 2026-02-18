export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    sessionId: String;
    roles: string[];         
    permissions: string[];   
    userId: number;          
    email: string; 
}


