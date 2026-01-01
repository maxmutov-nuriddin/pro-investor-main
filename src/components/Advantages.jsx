import React from "react";

const Advantages = () => {
  return (
    <section className="container flex flex-col gap-10 ">
      <h2 className="font-medium text-3xl text-center">
        5 преимуществ инвестирования в ПАММ-счета
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 grid-rows-2 gap-10">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-img/icon_1.svg" alt="logo image" className="md:w-13 md:h-13 w-10 h-10" />
            <h3 className="font-medium text-xl md:text-2xl">Сверхдоходность</h3>
          </div>
          <p className="text-2xl text-[#555454]">
            Трёхзначная потенциальная доходность при инвестициях в торговлю
            опытных трейдеров
          </p>
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2 lg:col-start-3 border rounded-2xl p-5 ">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-img/icon_2.svg" alt="logo image" className="md:w-13 md:h-13 w-10 h-10" />
            <h3 className="font-medium text-2x"> md:text-2xlГибкие сроки</h3>
          </div>
          <p className="text-2xl text-[#555454]">
            Различные по срокам условия инвестирования средств от одного месяца
            до года и больше
          </p>
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2 lg:col-start-5 border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-img/icon_3.svg" alt="logo image" className="md:w-13 md:h-13 w-10 h-10" />
            <h3 className="font-medium text-xl md:text-2xl">Быстрота</h3>
          </div>
          <p className="text-2xl text-[#555454]">
            Экономьте время на обучении, изучении аналитики и самостоятельной
            торговле
          </p>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-2 border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-img/icon_4.svg" alt="logo image" className="md:w-13 md:h-13 w-10 h-10" />
            <h3 className="font-medium text-xl md:text-2xl">Прозрачность</h3>
          </div>
          <p className="text-2xl text-[#555454]">
            Следите за графиком торговли управляющего и проведенными операциями
          </p>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-4 lg:row-start-2 border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-img/Group 2.svg" className="md:w-103md:h-10 3-10 h-10" />
            <h3 className="font-medium text-xl md:text-2xl">Профессионализм</h3>
          </div>
          <p className="text-2xl text-[#555454]">
            Трейдинг осуществляется под полным контролем профессиональных
            управляющих
          </p>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
