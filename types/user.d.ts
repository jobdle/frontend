interface User {
  firstname: string;
  lastname: string;
  tel: string;
  password: string;
  email: string;
  role: string;
  _id: string;
  updatedAt: string;
  verifyEmail: number;
  profileImageUrl: string;
}

interface UserEditable {
  profileImageUrl: string;
  firstname: string;
  lastname: string;
  tel: string;
  email: string;
}
