export interface User {
  idUsers: number;
  name: string;
  lastname: string;
  birthDate: string;
  phone: string;
  email: string;
  id: number;
  active: boolean;
  roleName: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyId: number;
}
