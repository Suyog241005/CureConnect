import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import "./i18";
import Navbar from "./components/Navbar";
import Cards from "./components/Hero";
import Footer from "./components/Foooter"

function App() {
  const { i18n } = useTranslation();

  return (
    <div>
        <Navbar />
        <Cards />
        <Footer/>
      </div>
  );
}

export default App;