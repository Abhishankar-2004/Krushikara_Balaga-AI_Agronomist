import React, { createContext, useState, useContext, ReactNode } from 'react';
import { storageService } from './services/storageService';
import { UserProfile } from './types';

export interface AuthUser extends UserProfile {
    email: string;
}

interface StoredUser extends AuthUser {
    password_sim: string; // Not a hash, just for simulation
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password_sim: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password_sim: string) => boolean;
  updateUser: (updatedUser: Omit<UserProfile, 'email'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'kisan_users';
const SESSION_STORAGE_KEY = 'kisan_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => storageService.getItem<AuthUser>(SESSION_STORAGE_KEY));

  const signup = (name: string, email: string, password_sim: string): boolean => {
    const users = storageService.getItem<StoredUser[]>(USERS_STORAGE_KEY) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // User already exists
    }
    const newUser: StoredUser = { name, email, password_sim, location: '' };
    users.push(newUser);
    storageService.setItem(USERS_STORAGE_KEY, users);
    
    const { password_sim: _, ...userToSet } = newUser;
    setUser(userToSet);
    storageService.setItem(SESSION_STORAGE_KEY, userToSet);
    
    return true;
  };

  const login = (email: string, password_sim: string): boolean => {
    const users = storageService.getItem<StoredUser[]>(USERS_STORAGE_KEY) || [];
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password_sim === password_sim);
    
    if (foundUser) {
      const { password_sim: _, ...userToSet } = foundUser;
      setUser(userToSet);
      storageService.setItem(SESSION_STORAGE_KEY, userToSet);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storageService.removeItem(SESSION_STORAGE_KEY);
  };
  
  const updateUser = (updatedUserInfo: Omit<UserProfile, 'email'>) => {
    if (!user) return;

    const updatedUser: AuthUser = { ...user, ...updatedUserInfo };
    setUser(updatedUser);
    storageService.setItem(SESSION_STORAGE_KEY, updatedUser);

    const users = storageService.getItem<StoredUser[]>(USERS_STORAGE_KEY) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        const updatedStoredUser: StoredUser = { ...users[userIndex], ...updatedUserInfo, email: user.email };
        users[userIndex] = updatedStoredUser;
        storageService.setItem(USERS_STORAGE_KEY, users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
