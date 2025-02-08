// For register
export interface IAuthRegister {
  username: string;
  email: string;
  password: string;
  role: string;
}

// For login
export interface IAuthLogin {
  email: string;
  password: string;
}
