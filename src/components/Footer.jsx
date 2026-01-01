import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center md:px-10 py-10 px-3 bg-[#242424]">
      <Link to="/">
        <img src="/header.svg" alt="logo" />
      </Link>
      <nav>
        <ul className="flex justify-between items-center md:gap-4 gap-2">
          <li>
            <Link
              to="/login"
              className="border rounded-md md:px-10 px-8 py-2 text-white hover:border-[#d52b1e] hover:bg-[#D52B1E] hover:text-[#fff]"
            >
              Вход
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="rounded-md md:px-4 px-2 py-2 hover:bg-red-800 transition bg-[#D52B1E] text-[#fff]"
            >
              Регистрация
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
