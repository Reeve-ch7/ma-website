import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiVerify } from '../api/backend';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ma-admin-token') || '');
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setVerified(false);
      setChecking(false);
      return;
    }
    apiVerify().then((ok) => {
      setVerified(ok);
      if (!ok) {
        localStorage.removeItem('ma-admin-token');
        setToken('');
      }
      setChecking(false);
    });
  }, [token]);

  const login = (tok) => {
    localStorage.setItem('ma-admin-token', tok);
    setToken(tok);
    setVerified(true);
  };

  const logout = () => {
    localStorage.removeItem('ma-admin-token');
    setToken('');
    setVerified(false);
  };

  return (
    <AdminContext.Provider value={{ token, isAdmin: verified, checking, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
