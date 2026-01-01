import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server"; // axios.create()

export default function AccountTopUp() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountId: "", // This will store accountNumber now
    amount: "",
    comment: "",
    contactMethod: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch accounts for dropdown
    const fetchAccounts = async () => {
      try {
        const res = await request.get("/accounts");
        const data = Array.isArray(res.data) ? res.data : res.data.accounts || [];
        setAccounts(data);
        // Pre-select first account if available
        if (data.length > 0) {
          setForm(prev => ({ ...prev, accountId: data[0].accountNumber }));
        }
      } catch (err) {
        console.error("Failed to fetch accounts", err);
        toast.error("Не удалось загрузить счета");
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateContactMethod = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{7,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { accountId, amount, comment, contactMethod } = form;

    if (!accountId || !amount || !comment || !contactMethod) {
      toast.warn("Заполните все поля!");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("Сумма должна быть больше 0");
      return;
    }

    if (!validateContactMethod(contactMethod)) {
      toast.error("Введите корректный email или телефон");
      return;
    }

    try {
      setLoading(true);

      await request.post("/deposit", {
        accountId, // Sending accountNumber
        amount: Number(amount),
        comment,
        contactMethod,
      });

      toast.success("Заявка успешно отправлена ✅");

      setForm(prev => ({
        ...prev,
        amount: "",
        comment: "",
        contactMethod: "",
      }));
    } catch (err) {
      console.error("Ошибка отправки заявки:", err);
      toast.error(
        err.response?.data?.message || "Ошибка при отправке заявки ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="colored"
      />

      <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Пополнение счёта</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Счет пополнения */}
          <div>
            <label className="block text-sm font-medium mb-2">Счет</label>
            <select
              name="accountId"
              value={form.accountId}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={loading}
            >
              {accounts.length === 0 && <option value="">Нет доступных счетов</option>}
              {accounts.map(acc => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} ({acc.balance} RUB)
                </option>
              ))}
            </select>
          </div>

          {/* Сумма */}
          <div>
            <label className="block text-sm font-medium mb-2">Сумма</label>
            <input
              type="number"
              min="1"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Введите сумму"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Комментарий
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Например: Пополнение через банк"
              rows="3"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Контакт */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Контактный метод
            </label>
            <input
              type="text"
              name="contactMethod"
              value={form.contactMethod}
              onChange={handleChange}
              placeholder="Email или телефон"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-white ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {loading ? "Отправка..." : "Сформировать заявку"}
          </button>
        </form>
      </div>
    </>
  );
}
