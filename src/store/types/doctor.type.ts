export interface Doctor {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  specialization: string;
  license_number: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}
