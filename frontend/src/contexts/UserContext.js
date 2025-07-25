import React, { createContext } from 'react';
export const UserContext = createContext(null);
export const UserProvider = ({ children }) => (
  <UserContext.Provider value={null}>{children}</UserContext.Provider>
);
