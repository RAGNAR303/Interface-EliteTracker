import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";

// type que exporta como vai madar os
export type UserData = {
  avatarUrl: string;
  id: string;
  name: string;
  token: string;
};

type UserContextProps = {
  getUserInfo: (githubCode: string) => Promise<void>;
  userData: UserData;
  logout: () => void;
};

type UserProviderProps = {
  children: ReactNode;
};

export const useLocalStorageKey = `${import.meta.env.VITE_LOCALSTORAGE_KEY}:useData`;

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData>({} as UserData);
  // salva os dados no navegador do usuario
  function putUserData(data: UserData) {
    setUserData(data);

    localStorage.setItem(useLocalStorageKey, JSON.stringify(data));
  }

  // chamada a API
  async function getUserInfo(githubCode: string) {
    const { data } = await api.get<UserData>("/auth/callback", {
      params: {
        code: githubCode,
      },
    });
    // passando as info dos user
    putUserData(data);
  }

  // Trazer a chave e o item que esta armazenado no localstore no navegador
  async function loadUserData() {
    const localData = localStorage.getItem(useLocalStorageKey);

    if (localData) {
      setUserData(JSON.parse(localData) as UserData);
    }
  }
  // renderiza o que esta salvo novamente no nevegador
  useEffect(() => {
    loadUserData();
  }, []);

  async function logout() {
    setUserData({} as UserData);

    localStorage.removeItem(useLocalStorageKey);
  }

  return (
    <UserContext.Provider value={{ userData, getUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUSer must be used with UserContext(useUSer deve ser usado com UserContext)",
    );
  }

  return context;
}
