import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import "./i18";
import Navbar from "./components/Navbar";
import Cards from "./components/Hero";
import Footer from "./components/Foooter"
import { BrowserRouter , Routes, Route } from "react-router-dom";
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
        </Routes>
       </div>
  );
}

export default App;