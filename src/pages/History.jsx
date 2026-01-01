import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
} from "lucide-react";
import request from "../services/Server"; // твой axios.create()

export default function History() {
  const [filter, setFilter] = useState("all");
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { value: "all", label: "Все операции" },
    { value: "profit", label: "Прибыль" },
    { value: "withdraw", label: "Вывод" },
    { value: "deposit", label: "Пополнение" },
  ];

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const res = await request.get("/operations");

        // Универсально: если это массив — ставим, если объект — достаём
        const ops = Array.isArray(res.data)
          ? res.data
          : res.data.operations || [];
        setOperations(ops);
      } catch (err) {
        console.error("Ошибка загрузки операций:", err);
        setOperations([]); // чтобы точно был массив
      } finally {
        setLoading(false);
      }
    };

    fetchOperations();
  }, []);

  const filteredOperations =
    filter === "all"
      ? operations
      : filter === "transfer"
        ? operations.filter((op) => op.type === "transfer_in" || op.type === "transfer_out")
        : operations.filter((op) => op.type === filter);

  const grouped = filteredOperations.reduce((acc, op) => {
    if (!acc[op.date]) acc[op.date] = [];
    acc[op.date].push(op);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("ru-RU", options);
  };

  const getIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="w-6 h-6 text-green-500" />;
      case "withdraw":
        return <ArrowUpCircle className="w-6 h-6 text-red-500" />;
      case "profit":
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      case "transfer_in":
        return <ArrowDownCircle className="w-6 h-6 text-indigo-500" />;
      case "transfer_out":
        return <ArrowUpCircle className="w-6 h-6 text-indigo-500" />;
      default:
        return <Wallet className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-gray-50 p-4 sm:p-6 rounded-2xl shadow">
        <p className="text-center text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-50 p-4 sm:p-6 rounded-2xl shadow">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
        История
      </h2>

      {/* Фильтры */}
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${filter === f.value
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
          >
            {f.label}
          </button>
        ))}
        {/* Добавляем кнопку фильтра для переводов */}
        <button
          onClick={() => setFilter("transfer")}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${filter === "transfer"
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
        >
          Переводы
        </button>
      </div>

      {/* Список по датам */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-500">Нет операций</p>
      ) : (
        Object.keys(grouped)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => (
            <div key={date} className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-center sm:text-left">
                {formatDate(date)}
              </h3>

              <div className="space-y-3">
                {grouped[date].map((op) => (
                  <div
                    key={op.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg shadow-sm border gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(op.type)}
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {op.type === 'transfer_out' ? `Перевод для ${op.account}` :
                            op.type === 'transfer_in' ? `Перевод от ${op.account}` :
                              `на ${op.account || 'Счет'}`}
                        </p>
                        <p className="text-gray-800 font-medium flex items-center gap-1 text-sm">
                          {op.type === "deposit" && "Пополнение"}
                          {op.type === "withdraw" && "Вывод"}
                          {op.type === "profit" && "Прибыль"}
                          {(op.type === "transfer_out" || op.type === "transfer_in") && "Перевод"}

                          {/* Статус Операции */}
                          {op.status === 'pending' && <span title="Ожидает" className="text-yellow-500">⏳</span>}
                          {op.status === 'approved' && <span title="Выполнено" className="text-green-500">✔</span>}
                          {op.status === 'rejected' && <span title="Отклонено" className="text-red-500">❌</span>}
                          {!op.status && <span className="text-green-500">✔</span>} {/* Fallback */}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold text-right sm:text-left text-sm sm:text-base ${
                        // Logic for color: Deposit/Profit/TransferIn = Green (pos), Withdraw/TransferOut = Red (neg)
                        (op.type === 'deposit' || op.type === 'profit' || op.type === 'transfer_in')
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {(op.type === 'deposit' || op.type === 'profit' || op.type === 'transfer_in') ? "+" : "-"}
                      {op.amount.toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      RUB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
