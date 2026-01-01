import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server";

export default function Transfer() {
   const [accounts, setAccounts] = useState([]);
   const [form, setForm] = useState({
      fromAccountId: "",
      toEmail: "",
      amount: "",
   });
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      // Fetch user accounts
      request.get("/accounts")
         .then(res => {
            const data = Array.isArray(res.data) ? res.data : res.data.accounts || [];
            setAccounts(data);
            if (data.length > 0) {
               setForm(prev => ({ ...prev, fromAccountId: data[0].id }));
            }
         })
         .catch(err => console.error("Error fetching accounts", err));
   }, []);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const { fromAccountId, toEmail, amount } = form;

      if (!fromAccountId || !toEmail || !amount) {
         toast.warn("Заполните все поля!");
         return;
      }

      if (Number(amount) <= 0) {
         toast.error("Сумма должна быть больше 0");
         return;
      }

      try {
         setLoading(true);
         await request.post("/transfer", {
            fromAccountId,
            toEmail,
            amount: Number(amount)
         });

         toast.success("Заявка на перевод отправлена ⏳");
         setForm(prev => ({ ...prev, toEmail: "", amount: "" }));

         // Refresh accounts to show new balance (optional, but good UX)
         // For now just wait a bit or let user navigate away.
      } catch (err) {
         console.error("Transfer error:", err);
         toast.error(err.response?.data?.message || "Ошибка при переводе ❌");
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

         <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-2xl shadow mt-6">
            <h2 className="text-xl font-bold mb-4">Перевод пользователю</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Откуда */}
               <div>
                  <label className="block text-sm font-medium mb-2">Откуда (Ваш счет)</label>
                  <select
                     name="fromAccountId"
                     value={form.fromAccountId}
                     onChange={handleChange}
                     className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                     required
                  >
                     {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                           {acc.accountNumber} (Баланс: {acc.balance} RUB)
                        </option>
                     ))}
                  </select>
               </div>

               {/* Кому */}
               <div>
                  <label className="block text-sm font-medium mb-2">Кому (Email получателя)</label>
                  <input
                     type="email"
                     name="toEmail"
                     value={form.toEmail}
                     onChange={handleChange}
                     placeholder="user@example.com"
                     className="w-full rounded border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                     required
                     disabled={loading}
                  />
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
                     placeholder="0.00"
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
                  {loading ? "Обработка..." : "Перевести"}
               </button>
            </form>
         </div>
      </>
   );
}
