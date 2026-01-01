import { useNavigate } from "react-router-dom";
import { FileText, CreditCard } from "lucide-react";

export default function Replenish() {
  const navigate = useNavigate();

  const methods = [
    {
      id: "invoice",
      title: "Выставить счет",
      icon: <FileText className="w-7 h-7 text-gray-600" />,
      details: [
        "Комиссия: рассчитывается вашим банком",
        "Валюта: любая валюта",
        "Срок зачисления: 1–2 рабочих дня",
        "Пополнение с электронных кошельков невозможно, используйте банковские счета для перевода средств",
      ],
    },
    {
      id: "sbp",
      title: "СБП",
      icon: <CreditCard className="w-7 h-7 text-gray-600" />,
      details: [
        "Комиссия: 0%",
        "Валюта: RUB",
        "Срок зачисления: несколько минут",
        "Пополнение с электронных кошельков невозможно, используйте банковские счета для перевода средств",
      ],
    },
  ];

  const handleSelect = (id) => {
    navigate("/dashboard/accountTopUp", { state: { method: id } });
    // теперь на /accountTopUp можно получить метод через useLocation()
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="font-bold text-2xl mb-6">Пополнение баланса</h1>
      <p className="mb-6 font-medium text-lg">Выберите способ пополнения</p>

      {/* Карточки в 2 колонки на больших экранах */}
      <div className="grid grid-cols-1 gap-6">
        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className="border rounded-xl p-6 cursor-pointer transition-all duration-200 
  bg-gray-50 border-gray-200 
  hover:bg-white hover:shadow-lg hover:border-red-400"
          >
            <div className="flex items-center gap-3 font-semibold text-lg mb-4">
              {m.icon}
              <span>{m.title}</span>
            </div>

            {/* Всегда показываем детали */}
            <div className="text-gray-700 space-y-2 text-base">
              {m.details.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
