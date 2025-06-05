import { useState, createContext, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import "./App.css";
import MyApp from "./pages/dashboard/dashboard.tsx";
import PackingList from "./pages/packingList/packingList.tsx";
import Register from "./pages/auth/Register.tsx";
import Login from "./pages/auth/Login.tsx";
import NotFound from "./pages/notFound.tsx";
// import NotFound from "./pages/NotFound.tsx";

interface NameContextType {
  userID: string | undefined;
  setUserID: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface Props {
  children: ReactNode;
}

// Create a new context and export
export const NameContext = createContext<NameContextType | undefined>(
  undefined
);

// Create a Context Provider
const NameContextProvider: React.FC<Props> = ({ children }) => {
  const [userID, setUserID] = useState<string | undefined>(undefined);

  return (
    <NameContext.Provider value={{ userID, setUserID }}>
      {children}
    </NameContext.Provider>
  );
};

function App() {
  // const [userID, setUserID] = useState<string | null>(null);
  // let user_id = localStorage.getItem("userId") || "1"; // Default to "1" if not found
  // user_id = user_id.toString();
  // console.log("User ID from localStorage:", user_id);
  return (
    <NameContextProvider>
      <Router>
        <Routes>
          <Route path={`/:userID`} element={<MyApp/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} handle={Login} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={<Navigate to="/login" replace={true} />}
          />

          {/* <Route path="/packing_lists/:id" element={<PackingList />} /> */}
          {/* <Route path="/errorPage" element={<ErrorPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<ErrorPage />} /> */}
        </Routes>
      </Router>
    </NameContextProvider>
  );
}

export default App;
