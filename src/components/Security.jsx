import React from "react";

const Security = () => {
  return (
    <section className="container">
      <div>
        <h2 className="font-medium text-[25px]">Защита инвестиций</h2>
        <p className="font-normal text-[18px] ">
          Дилер биржевого рынка выступает в роли <b>независимого гаранта</b>{" "}
          выполнения обязательств как <br /> управляющего, так и инвестора.
          Отсюда вытекают следующие преимущества:
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-7">
        <div className="bg-[#E3EAF4] flex flex-col p-5 rounded-2xl">
          <span className="text-[#939AA4] text-5xl text-end">01</span>
          <p className="font-normal text-[18px]">
            Управляющий не может взять и уйти с деньгами инвесторов.
          </p>
        </div>

        <div className="bg-[#E3EAF4] flex flex-col p-5 rounded-2xl">
          <span className="text-[#939AA4] text-5xl text-end">02</span>
          <p className="font-normal text-[18px]">
            Ваши средства и прибыль находятся на общем ПАММ-счёте, и только вы
            можете распоряжаться ими, так как они не передаются управляющему.
          </p>
        </div>

        <div className="bg-[#E3EAF4] flex flex-col p-5 rounded-2xl">
          <span className="text-[#939AA4] text-5xl text-end">03</span>
          <p className="font-normal text-[18px]">
            При консервативной торговле управляющий рискует только прибылью, а
            не капиталом инвесторов.
          </p>
        </div>
      </div>

      <div className="">
        <p className="font-normal text-[18px] text-right">
          Вывод прибыли. ПАММ-сервис позволяет настроить автоматический вывод{" "}
          <br />
          прибыли по окончанию торгового интервала, что обеспечит Вам постоянный{" "}
          <br />
          поток прибыли и ее сохранение на своем отдельном торговом счете.
        </p>
      </div>
    </section>
  );
};

export default Security;
