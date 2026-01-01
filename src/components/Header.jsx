import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center md:mx-10 mt-5 mx-3">
      <Link to="/">
        <img src="/header.svg" alt="logo" />
      </Link>
      <nav>
        <ul className="flex justify-between items-center md:gap-4 gap-2">
          <li>
            <Link to="/login" className="border rounded-md md:px-10 px-8 py-2 hover:bg-[#D52B1E] transition hover:text-[#fff]" >Вход</Link>
          </li>
          <li>
            <Link to="/register" className="border rounded-md md:px-4 px-2 py-2 hover:bg-red-800 transition bg-[#D52B1E] text-[#fff]">Регистрация</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
