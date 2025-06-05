import { IUserLogin, } from "@/commons/UserInterfaces";
import { api } from "@/lib/axios";

const login = async (user: IUserLogin) => {
  const response = await api.post("/login", user);
  const { token, user: userInfo } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userInfo));

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return response;
};

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getUserRole = () => {
  const user = getUser();
  return user?.authorities?.[0]?.authority || null;
};

const getTipoPerfil = () => {
  const user = getUser();
  return user?.tipoPerfil || null;
};

const getUserEmail = () => {
  const user = getUser();
  return user?.email || null;
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
  getUserEmail,
  getTipoPerfil,
  getUserRole
};
export default AuthService;
