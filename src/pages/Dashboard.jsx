import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import request from "../services/Server";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await request.get("/accounts");

        // Если сервер вернул { accounts: [...] }
        const data = Array.isArray(res.data) ? res.data : res.data.accounts || [];
        setAccounts(data);
      } catch (err) {
        console.error("Ошибка загрузки счетов:", err);
        toast.error("Не удалось загрузить счета");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Считаем общую сумму всех счетов
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  );

  return (
    <div>
      {/* Шапка */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl">Быстрые действия</h1>
      </header>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Link
          to="/dashboard/replenish"
          className="relative h-40 bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md"
        >
          <img
            className="absolute w-40 h-40 right-0 rounded-xl bottom-0"
            src="/logo-img/Group 26.svg"
            alt="logo"
          />
          <p className="font-semibold text-2xl">Пополнить баланс</p>
          <p className="text-sm text-gray-500">Удобно без комиссии</p>
        </Link>
        <Link
          to="/dashboard/bills"
          className="relative h-40 bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md"
        >
          <img
            className="absolute w-40 h-40 right-0 rounded-xl bottom-0"
            src="/logo-img/Group 26-1.svg"
            alt="logo"
          />
          <p className="font-semibold text-2xl">Открыть счет</p>
          <p className="text-sm text-gray-500">Практически мгновенно</p>
        </Link>
        <Link
          to="/dashboard/transfer"
          className="relative h-40 bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md"
        >
          <img
            className="absolute w-40 h-40 right-0 rounded-xl bottom-0"
            src="/logo-img/Group 26-2.svg"
            alt="logo"
          />
          <p className="font-semibold text-2xl">
            Перевод <br /> средств
          </p>
          <p className="text-sm text-gray-500">Между пользователями</p>
        </Link>
      </div>

      {/* Баланс */}
      <div className="bg-white rounded-xl shadow p-6 mb-12">
        <h2 className="text-gray-500 text-sm">Всего на торговых счетах</h2>
        <p className="text-2xl font-bold mt-2">
          {totalBalance.toLocaleString()} RUB
        </p>

        {/* Список счетов */}
        <div className="mt-4 border-t pt-4 space-y-4">
          {loading ? (
            <p className="text-gray-500">Загрузка счетов...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">Нет доступных счетов</p>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id || acc.accountNumber}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-500 text-sm">Номер счета</p>
                  <p className="font-mono text-lg">
                    {acc.accountNumber || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Баланс</p>
                  <p className="font-semibold">
                    {(acc.balance || 0).toLocaleString()} RUB &nbsp;
                    <span className={`text-sm ${(acc.balance - acc.income) >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      {acc.income > 0
                        ? (((acc.balance - acc.income) / acc.income) * 100).toFixed(2)
                        : "0.00"}%
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
