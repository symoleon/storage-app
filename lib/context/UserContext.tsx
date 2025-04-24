import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserContextType = {
  user: string;
  setUser: (user: string) => void;
};

export const UserContext = createContext<UserContextType>({
  user: '',
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>('0');
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context.user;
}