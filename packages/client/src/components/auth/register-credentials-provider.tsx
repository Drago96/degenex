"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { AuthDto } from "@degenex/common";

type RegisterCredentialsContextProps = {
  registerCredentials: AuthDto | null;
  setRegisterCredentials: (registerCredentials: AuthDto) => void;
};

const RegisterCredentialsContext =
  createContext<RegisterCredentialsContextProps>({
    registerCredentials: null,
    setRegisterCredentials: () => void 0,
  });

type RegisterCredentialsProviderProps = { children: ReactNode };

export default function RegisterCredentialsProvider({
  children,
}: RegisterCredentialsProviderProps) {
  const [registerCredentials, setRegisterCredentials] =
    useState<AuthDto | null>(null);

  return (
    <RegisterCredentialsContext.Provider
      value={{
        registerCredentials,
        setRegisterCredentials,
      }}
    >
      {children}
    </RegisterCredentialsContext.Provider>
  );
}

export const useRegisterCredentials = () => {
  return useContext(RegisterCredentialsContext);
};
