import React from "react";
import { Link } from "react-router-dom";

const Investing = () => {
  return (
    <section className="container grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="">
        <h2 className="text-3xl font-medium">
          Вклады в инвестиционные ПАММ счета
        </h2>
      </div>
      <div className="col-span-1 md:col-span-2 md:col-start-2">
        <h3 className="text-2xl font-medium">Сервис ПАММ счетов –</h3>
        <div className="flex flex-col gap-7 my-8">
          <p className="text-2xl text-[#525252]">
            это система процентного распределения прибыли между управляющим и
            инвестором
          </p>
          <p className="text-2xl text-[#525252]">
            Другими словами, ПАММ – счет где, управляющий имеет возможность
            использовать в торговле привлеченные средства инвесторов.
          </p>
          <p className="text-2xl text-[#525252]">
            Заключается оферта – это договор, в котором регламентируются
            отношения между инвестором и управляющим. Прибыль получаемая в
            результате торговой деятельности управляющего, распределяется между
            инвесторами пропорционально вложенной сумме.
          </p>
        </div>

        <Link
          to="/register"
          className=" rounded-md md:px-4 px-2 py-2 hover:bg-red-800 transition bg-[#D52B1E] text-[#fff]"
        >
          Попробовать
        </Link>
      </div>
    </section>
  );
};

export default Investing;
