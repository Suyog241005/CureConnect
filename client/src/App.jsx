import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import useChat from "./hooks/useChat"
import "./i18";
import Navbar from "./components/Navbar";
import Cards from "./components/Hero";
import Footer from "./components/Foooter"
import { BrowserRouter , Routes, Route } from "react-router-dom"
import FinalChat from "./pages/FinalChatApp";
import Layout from "./components/Layout";

function App() {
  const { i18n } = useTranslation();

  return (
      <div>
        <Routes>
          <Route path='/' element={<Layout/>}></Route>
        {/* <Navbar/>
        <Cards/>
        <Footer/> */}
        <Route path="/chat" element={<FinalChat/>}></Route>
        </Routes >
       </div>
  );
}

export default App;