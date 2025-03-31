import { useState, createContext, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import MyApp from "./pages/dashboard/dashboard.tsx";
import PackingList from "./pages/packingList/packingList.tsx";

interface NameContextType {
  id: string | undefined;
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  const [id, setId] = useState<string | undefined>(undefined);

  return (
    <NameContext.Provider value={{ id, setId }}>
      {children}
    </NameContext.Provider>
  );
};

function App() {
  return (
    <NameContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MyApp />} />
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
