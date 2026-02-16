export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterPatientDto {
  email: string;
  name: string;
  password: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
}

export interface RegisterDoctorDto {
  email: string;
  name: string;
  password: string;
  phone: string;
  address: string;
  license_number: string;
  specialization: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
