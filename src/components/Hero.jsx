import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[url(/hero-bg.png)] bg-no-repeat bg-cover bg-center w-[100%] h-[87.9vh] text-[#fff] ">
      <div className="flex flex-col gap-6 justify-center h-[87.9vh] container">
        <h1 className="font-normal md:text-5xl text-2xl">
          Инвестиции в счета <br /> профессиональных управляющих
        </h1>
        <p className="text-base">
          Уровень доходности <span className="text-[#D52B1E]">5% в месяц</span>{" "}
          привлекает инвесторов, стремящихся к приумножению средств.
        </p>
        <div className="mt-4">
          <Link
            to="/register"
            className="rounded-md md:px-4 px-2 py-2 hover:bg-red-800 transition bg-[#D52B1E] text-[#fff]"
          >
            Инвестировать
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
