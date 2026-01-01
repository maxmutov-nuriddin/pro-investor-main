import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Advantages from "../components/Advantages";
import Investing from "../components/Investing";
import Security from "../components/Security";
import Footer from "../components/Footer";
import TradingScheme from "../components/TradingScheme";

const Landing = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-30 my-10 ">
        <Hero />
        <Advantages />
        <TradingScheme />
        <Investing />
        <Security />
      </main>
      <Footer />
    </>
  );
};

export default Landing;
