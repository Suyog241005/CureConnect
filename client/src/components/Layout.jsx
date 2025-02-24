import React from "react";
import Navbar from "./Navbar";
import Footer from "./Foooter";
import Hero from './Hero'


const Layout = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <Footer />
    </div>
  );
};

export default Layout;