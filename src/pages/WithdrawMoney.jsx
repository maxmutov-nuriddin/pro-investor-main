import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server"; // axios.create()

export default function WithdrawMoney() {
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    bankName: "",
    recipientName: "",
    comment: "",
  });

  const [balance, setBalance] = useState(8000);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fromAccount, toAccount, amount, bankName, recipientName, comment } =
      form;

    if (!fromAccount || !toAccount || !amount || !bankName || !recipientName) {
      toast.warn("Заполните все обязательные поля!");
      return;
    }

    if (Number(amount) > balance) {
      toast.error("Недостаточно средств!");
      return;
    }

    try {
      setLoading(true);

      const res = await request.post("/operations/withdrawal", {
        accountId: fromAccount, // откуда списываем
        amount: Number(amount), // сумма
        comment: comment || "Вывод средств",
        withdrawalDetails: {
          bankName,
          cardNumber: toAccount, // куда зачисляем
          recipientName,
        },
      });

      if (res.data?.newBalance !== undefined) {
        setBalance(res.data.newBalance);
      } else {
        setBalance((prev) => prev - Number(amount));
      }

      toast.success("Вывод успешно выполнен ✅");

      // очистка формы
      setForm({
        fromAccount: "",
        toAccount: "",
        amount: "",
        bankName: "",
        recipientName: "",
        comment: "",
      });
    } catch (err) {
      console.error("Ошибка вывода:", err);
      toast.error(
        err.response?.data?.message || "Ошибка при выводе средств ❌"
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
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Вывод денег</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Счет и сумма списания */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl shadow">
            <h3 className="col-span-2 mb-2 font-inter font-semibold text-[20px]">
              Счет и сумма списания
            </h3>

            <input
              type="text"
              name="fromAccount"
              value={form.fromAccount}
              onChange={handleChange}
              placeholder="Введите счет списания"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Сумма"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Счет зачисления */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow space-y-4">
            <h3 className="mb-2 font-inter font-semibold text-[20px]">
              Счет зачисления
            </h3>

            <input
              type="text"
              name="toAccount"
              value={form.toAccount}
              onChange={handleChange}
              placeholder="Введите номер карты / счет зачисления"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Введите название банка"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="text"
              name="recipientName"
              value={form.recipientName}
              onChange={handleChange}
              placeholder="Введите имя получателя"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Комментарий (необязательно)"
              rows="3"
              className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Обработка..." : "Вывести деньги"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
