import { IUser } from "@/commons/UserInterfaces";
import { api } from "@/lib/axios";

const cadastrarUser = (user: IUser) => {
  return api.post("/users", user);
};

const editarUser = (id:number, user:IUser) => {
  return api.put(`/users/${id}`, user);

}

const deletarUser = (id: number) => {
  return api.delete(`/users/${id}`);
};

const listarUser = () => {
  return api.get<IUser[]>("/users");
};

const buscarUserPorId = (id: number) => {
  return api.get(`/users/${id}`);
};


const UserService = {
  cadastrarUser,
  editarUser,
  deletarUser,
  listarUser,
  buscarUserPorId
};
export default UserService;
