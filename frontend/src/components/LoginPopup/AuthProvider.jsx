// AuthProvider.js - An example using React Context for state management
import React, { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
 switch (action.type) {
   case "LOGIN":
     return { ...state, isAuthenticated: true, token: action.token };
   case "LOGOUT":
     return { ...state, isAuthenticated: false, token: null };
   default:
     return state;
 }
};

const AuthProvider = ({ children }) => {
 const [state, dispatch] = useReducer(authReducer, {
   isAuthenticated: false,
   token: null,
 });

 const login = (token) => dispatch({ type: "LOGIN", token });
 const logout = () => dispatch({ type: "LOGOUT" });

 return (
   <AuthContext.Provider value={{ state, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
};

const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error("useAuth must be used within an AuthProvider");
 }
 return context;
};

export { AuthProvider, useAuth };