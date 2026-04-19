import React, { createContext, useState, useContext, ReactNode } from 'react';
import { storageService } from './services/storageService';
import { UserProfile } from './types';

export interface AuthUser extends UserProfile {
    email: string;
}

interface StoredUser extends AuthUser {
    password_sim: string; // This will now be a base64 encoded string
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
    // "Hash" the password using base64 for simulation.
    // In a real app, use a proper hashing algorithm like bcrypt.
    const hashedPassword = btoa(password_sim);
    const newUser: StoredUser = { name, email, password_sim: hashedPassword, location: '' };
    users.push(newUser);
    storageService.setItem(USERS_STORAGE_KEY, users);
    
    const { password_sim: _, ...userToSet } = newUser;
    setUser(userToSet);
    storageService.setItem(SESSION_STORAGE_KEY, userToSet);
    
    return true;
  };

  const login = (email: string, password_sim: string): boolean => {
    const users = storageService.getItem<StoredUser[]>(USERS_STORAGE_KEY) || [];
    const lowerEmail = email.toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === lowerEmail);

    if (!foundUser) {
        return false;
    }

    const hashedPassword = btoa(password_sim);
    let passwordMatch = false;

    // Check for new "hashed" password first
    if (foundUser.password_sim === hashedPassword) {
        passwordMatch = true;
    } 
    // Backward compatibility: check for old plaintext password
    else if (foundUser.password_sim === password_sim) {
        passwordMatch = true;
        // Upgrade the password to the new "hashed" format upon successful login
        const userIndex = users.findIndex(u => u.email.toLowerCase() === lowerEmail);
        if (userIndex !== -1) {
            users[userIndex].password_sim = hashedPassword;
            storageService.setItem(USERS_STORAGE_KEY, users);
        }
    }

    if (passwordMatch) {
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
