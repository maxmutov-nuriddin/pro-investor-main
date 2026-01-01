import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.warn("Введите e-mail и пароль!");
    }

    try {
      const res = await request.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);

      if (res.data?.token) {
        Cookies.set("TOKEN", res.data.token, { expires: 7 });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      if (res.data.message !== "Email yoki parol xato" && res.data.message !== "Email или пароль неверны") {
        toast.success("Вход выполнен успешно!");

        setTimeout(() => {
          if (res.data.user?.role === 'admin') {
            navigate("/dashboard/admin");
          } else {
            navigate("/dashboard/dashboard", {
              state: { email: form.email },
            });
          }
        }, 1200);
      } else {
        toast.warn("Email или пароль не совпадают. Попробуйте ещё раз.");
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      toast.error("Ошибка сервера или неверные данные");
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
      <div className="bg-[#c9c9c9] min-h-screen flex flex-col">
        <div className="px-4 sm:px-10 py-5">
          <Link to="/">
            <img src="/header.svg" alt="logo" className="h-8 sm:h-10" />
          </Link>
        </div>

        <div className="flex flex-col gap-10 flex-1 items-center justify-center px-4">
          <div className="bg-white w-full max-w-[400px] flex flex-col p-6 sm:p-8 rounded-xl gap-6 shadow-md">
            <h2 className="font-semibold text-[22px] sm:text-[25px] text-left">
              Вход
            </h2>

            <form
              className="flex flex-col items-center gap-6 w-full"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                autoComplete="username"
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition">
                Войти
              </button>
            </form>

            <Link
              className="text-center text-sm text-gray-600 hover:text-gray-800"
              to="/help"
            >
              <u>Не могу войти</u>
            </Link>
          </div>

          <Link className="text-[#D52B1E]" to="/register">
            Регистрация
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
