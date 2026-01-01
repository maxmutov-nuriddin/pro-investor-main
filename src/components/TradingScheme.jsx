import React from "react";

const TradingScheme = () => {
  return (
    <section className="container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 grid-rows-6 gap-2 items-center text-center ">
      <div className="mx-auto col-start-1 md:col-start-3 mx-auto">
        <p>Управляющий</p>
        <img className="bg-[#363636] rounded-[60%] border-5 border-[#E3EAF4]" src="/logo-img/Vector.svg" alt="icon" />
      </div>

      <div className="mx-auto col-start-2 sm:col-start-4 row-start-2 col-span-2 row-span-2 md:block hidden">
        <img src="/logo-img/Vector 3.svg" alt="icon" />
      </div>
      <div className=" col-start-1 md:col-start-3 row-start-2">
        <p>Торговая платформа</p>
        <img className="mx-auto" src="/logo-img/Vector-1.svg" alt="icon" />
      </div>
      <div className="mx-auto col-start-1 row-start-2 col-span-2 row-span-2 md:block hidden">
        <img src="/logo-img/Vector 4.svg" alt="icon" />
      </div>
      <div className="mx-auto lg:row-start-4 row-start-4 col-start-5 md:block hidden">
        <img src="/logo-img/Vector-1.svg" alt="icon" />
      </div>
      <div className="mx-auto lg:row-start-4 row-start-6 md:row-start-5 col-start-1 lg:col-start-2">
        <p>Инвестиционный счет</p>
      </div>
      <div className="mx-auto row-start-4 hidden lg:block">
        <img src="/logo-img/Vector-1.svg" alt="icon" />
      </div>
      <div className="lg:row-start-4 row-start-5 col-start-5 lg:col-start-4 md:block hidden">
        <p>Инвестиционный счет</p>
      </div>
      <div className="mx-auto row-start-5 md:row-start-4 col-start-1 ">
        <img src="/logo-img/Vector-1.svg" alt="icon" />
      </div>
      <div className="mx-auto col-start-1 md:col-start-3 row-start-3">
        <p>Доверительное управление торговлей</p>
      </div>
      <div className="mx-auto row-start-4 col-start-1 md:hidden">
         <img src="/logo-img/Vector 12.svg" alt="" />
      </div>
      <div className="mx-auto lg:row-start-5 row-start-7 md:row-start-6 flex items-center justify-between">
        <img src="/logo-img/Vector 8.svg" alt="icon" />
        <img src="/logo-img/Иконка доллар.svg" alt="dolor" />
        <img src="/logo-img/Vector 9.svg" alt="icon" />
      </div>
      <div className="mx-auto col-start-2 sm:col-start-3 items-center flex justify-between hidden lg:flex">
        <img src="/logo-img/Vector 8.svg" alt="icon" />
        <img src="/logo-img/Иконка доллар.svg" alt="dolor" /> 
        <img src="/logo-img/Vector 9.svg" alt="icon" />
      </div>
      <div className="md:flex hidden mx-auto col-start-2 sm:col-start-5 lg:row-start-5 row-start-6 flex items-center justify-between">
        <img src="/logo-img/Vector 8.svg" alt="icon" />
        <img src="/logo-img/Иконка доллар.svg" alt="dolor" />
        <img src="/logo-img/Vector 9.svg" alt="icon" />
      </div>
      <div className="mx-auto lg:row-start-6 row-start-8 md:row-start-7">
        <img src="/logo-img/Иконка инвестор.svg" alt="icon" />
      </div>
      <div className="mx-auto lg:row-start-6 md:row-start-8 row-start-9">
        <p>Инвестор</p>
      </div>
      <div className="mx-auto row-start-6 hidden lg:block">
        <img src="/logo-img/Иконка инвестор.svg" alt="icon" />
      </div>
      <div className="mx-auto lg:row-start-6 row-start-8 col-start-5 lg:col-start-4 md:block hidden">
        <p>Инвестор</p>
      </div>
      <div className="mx-auto lg:row-start-6 row-start-7 col-start-5 md:block hidden">
        <img src="/logo-img/Иконка инвестор.svg" alt="icon" />
      </div>
    </section>
  );
};

export default TradingScheme;
