import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { IUserDTO } from "@/commons/UserInterfaces";

export const useAuthUser = () => {
  const [user, setUser] = useState<IUserDTO | null>(null);

  useEffect(() => {
    api.get("/login/user-info").then((res) => {
      setUser(res.data);
    });
  }, []);

  return user;
};
