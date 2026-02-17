type UserRole = "patient" | "doctor" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  __v: number;
}

export interface PatientProfile {
  user: User;
  date_of_birth: string; 
  gender: "male" | "female" | "other";
  phone: string;
}
