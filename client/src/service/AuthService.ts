import { IUserLogin, } from "@/commons/UserInterfaces";
import { api } from "@/lib/axios";

const login = (user: IUserLogin) => {
  return api.post("/login", user);
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return token ? true : false;
};

const logout = () => {
  localStorage.removeItem("token"); 
};

const AuthService = {
  login,
  isAuthenticated,
  logout,
};
export default AuthService;
