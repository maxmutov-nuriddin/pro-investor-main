import { useState, useEffect } from "react";
import { PlusCircle, CreditCard, DollarSign, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../services/Server";

export default function Bills() {
  const [activeTab, setActiveTab] = useState("trading");
  const [activeCurrency, setActiveCurrency] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [manual, setManual] = useState(false);
  const [currency, setCurrency] = useState("RUB");

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // форма
  const initialForm = {
    bikOrBank: "",
    accountNumber: "",
    bankName: "",
    inn: "",
    kpp: "",
    corrAccount: "",
    bank: "Другой банк",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // закрытие формы
  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setErrors({});
  };

  // загрузка счетов с backend
  const loadAccounts = async () => {
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

  useEffect(() => {
    loadAccounts();
  }, []);

  // обновление полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // сабмит формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Проверяем каждое поле (только если оно не disabled)
    if (!form.bikOrBank) newErrors.bikOrBank = "Введите БИК или название банка";
    if (!form.accountNumber) newErrors.accountNumber = "Введите номер счета";
    if (manual && !form.bankName) newErrors.bankName = "Введите название банка";
    if (manual && !form.inn) newErrors.inn = "Введите ИНН";
    if (manual && !form.kpp) newErrors.kpp = "Введите КПП";
    if (manual && !form.corrAccount)
      newErrors.corrAccount = "Введите корр. счет";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const dataToSend = {
        currency,
        bikOrBank: form.bikOrBank,
        accountNumber: form.accountNumber,
        ...(manual && {
          bankName: form.bankName,
          inn: form.inn,
          kpp: form.kpp,
          corrAccount: form.corrAccount,
        }),
      };

      try {
        await request.post("/accounts", dataToSend);
        toast.success("Счёт успешно добавлен!");
        await loadAccounts(); // обновляем список
        closeForm(); // сбрасываем форму
      } catch (err) {
        console.error("Ошибка добавления счета:", err);
        toast.error("Не удалось добавить счёт");
      }
    }
  };

  const filteredAccounts =
    activeCurrency === "ALL"
      ? accounts
      : accounts.filter((acc) => acc.currency === activeCurrency);
      
  // Общая сумма по всем торговым счетам (например, RUB)
  const totalBalance = accounts
    .filter((acc) => acc.currency === "RUB") // только торговые, если нужно
    .reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="p-4 md:p-6">
      <h1 className="font-bold text-xl mb-4">Счета</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("trading")}
          className={`px-4 py-2 font-medium ${
            activeTab === "trading"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Торговые счета
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`px-4 py-2 font-medium ${
            activeTab === "bank"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Банковские счета
        </button>
      </div>

      {/* Content */}
      {activeTab === "trading" ? (
        <>
          {/* Быстрые действия */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link
              to="/dashboard/replenish"
              className="flex flex-col items-center bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-md"
            >
              <PlusCircle className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm font-medium">Пополнить баланс</p>
            </Link>
            <Link
              to="/dashboard/bills"
              className="flex flex-col items-center bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-md"
            >
              <CreditCard className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm font-medium">Открыть счет</p>
            </Link>
            <Link
              to="/dashboard/withdrawMoney"
              className="flex flex-col items-center bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-md"
            >
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm font-medium">Обмен валюты и перевод</p>
            </Link>
            <Link
              to="/dashboard/withdrawMoney"
              className="flex flex-col items-center bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-md"
            >
              <Wallet className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm font-medium">Вывести</p>
            </Link>
          </div>

          {/* Баланс */}
          {/* Общий баланс */}
          <div className="bg-white rounded-xl shadow p-6 mb-12">
            <h2 className="text-gray-500 text-sm">Всего на торговых счетах</h2>
            <p className="text-2xl font-bold mt-2">{totalBalance} RUB</p>
          </div>

          {/* Каждый счёт */}
          <div className="space-y-4">
            {accounts
              .filter((acc) => acc.currency === "RUB") // только торговые, если надо
              .map((acc) => (
                <div key={acc.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Номер счета</p>
                      <p className="font-mono text-lg flex items-center gap-2">
                        {acc.accountNumber}{" "}
                        <span className="cursor-pointer text-gray-400">📋</span>
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-gray-500 text-sm">Баланс</p>
                      <p className="font-semibold">
                        {acc.balance} {acc.currency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="p-4 md:p-6">
          {/* Добавить счет */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-600"
            >
              Добавить счет
            </button>
          )}

          {/* Форма */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white shadow p-4 rounded-lg mb-6"
            >
              {/* Валюта */}
              <div className="flex gap-2 mb-2 flex-wrap">
                {["RUB", "CNY", "EUR", "USD"].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      cur === currency
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              {/* Чекбокс */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={manual}
                  onChange={(e) => setManual(e.target.checked)}
                />
                <span>Заполнить вручную</span>
              </label>

              {/* Поля */}
              {/* bikOrBank */}
              <div>
                <input
                  type="text"
                  name="bikOrBank"
                  placeholder="Введите БИК или название банка"
                  value={form.bikOrBank}
                  onChange={handleChange}
                  className={`w-full rounded p-2 bg-gray-100  ${
                    errors.bikOrBank
                      ? "border-red-500 border"
                      : "border-gray-100"
                  }`}
                />
                {errors.bikOrBank && (
                  <p className="text-red-500 text-sm">{errors.bikOrBank}</p>
                )}
              </div>

              {/* accountNumber */}
              <div>
                <input
                  type="number"
                  name="accountNumber"
                  placeholder="Номер счета"
                  value={form.accountNumber}
                  onChange={handleChange}
                  className={`w-full rounded p-2 bg-gray-100  ${
                    errors.accountNumber
                      ? "border-red-500 border"
                      : "border-gray-100"
                  }`}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">{errors.accountNumber}</p>
                )}
              </div>

              {/* bankName */}
              <div>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Название банка"
                  value={form.bankName}
                  onChange={handleChange}
                  disabled={!manual}
                  className={`w-full bg-gray-100 rounded p-2  ${
                    !manual
                      ? " text-gray-400 cursor-not-allowed"
                      : errors.bankName
                      ? "border-red-500 border"
                      : "border-gray-100 "
                  }`}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm">{errors.bankName}</p>
                )}
              </div>

              {/* inn */}
              <div>
                <input
                  type="number"
                  name="inn"
                  placeholder="ИНН"
                  value={form.inn}
                  onChange={handleChange}
                  disabled={!manual}
                  className={`w-full bg-gray-100 rounded p-2  ${
                    !manual
                      ? " text-gray-400 cursor-not-allowed"
                      : errors.inn
                      ? "border-red-500 border"
                      : "border-gray-100"
                  }`}
                />
                {errors.inn && (
                  <p className="text-red-500 text-sm">{errors.inn}</p>
                )}
              </div>

              {/* kpp */}
              <div>
                <input
                  type="number"
                  name="kpp"
                  placeholder="КПП"
                  value={form.kpp}
                  onChange={handleChange}
                  disabled={!manual}
                  className={`w-full bg-gray-100 rounded p-2  ${
                    !manual
                      ? " text-gray-400 cursor-not-allowed"
                      : errors.kpp
                      ? "border-red-500 border"
                      : "border-gray-100"
                  }`}
                />
                {errors.kpp && (
                  <p className="text-red-500 text-sm">{errors.kpp}</p>
                )}
              </div>

              {/* corrAccount */}
              <div>
                <input
                  type="number"
                  name="corrAccount"
                  placeholder="Корр. счет банка"
                  value={form.corrAccount}
                  onChange={handleChange}
                  disabled={!manual}
                  className={`w-full bg-gray-100 rounded p-2  ${
                    !manual
                      ? "text-gray-400 cursor-not-allowed"
                      : errors.corrAccount
                      ? "border-red-500 border"
                      : "border-gray-100"
                  }`}
                />
                {errors.corrAccount && (
                  <p className="text-red-500 text-sm">{errors.corrAccount}</p>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Добавить счет
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Фильтр валют */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["ALL", "RUB", "CNY", "EUR", "USD"].map((cur) => (
              <button
                key={cur}
                onClick={() => setActiveCurrency(cur)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeCurrency === cur
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cur === "ALL" ? "Все" : cur}
              </button>
            ))}
          </div>

          {/* Список счетов */}
          {/* Список счетов */}
          <div className="space-y-3 mb-12">
            {loading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : Array.isArray(filteredAccounts) &&
              filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-gray-100 border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
                      {acc.currency}
                    </span>
                    <div>
                      <p className="font-mono font-semibold">
                        {acc.accountNumber}
                      </p>
                      <p className="text-sm text-gray-500">{acc.bank}</p>
                    </div>
                  </div>
                  <p className="mt-2 md:mt-0 text-gray-600">{acc.currency}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Нет счетов для выбранной валюты</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
