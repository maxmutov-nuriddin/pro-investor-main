import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server";
import Cookies from "js-cookie";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password || !confirmPassword) {
      return setError("Заполните все поля!");
    }

    if (form.password.length < 8) {
      return setError("Пароль не должен быть меньше 8 символов!");
    }

    if (form.password !== confirmPassword) {
      return setError("Пароли не совпадают!");
    }

    try {
      const res = await request.post("/auth/register", form);

      // сохранить токен, если backend его отдаёт
      if (res.data?.token) {
        // eslint-disable-next-line no-undef
        Cookies.set("TOKEN", res.data.token, { expires: 7 });
      }

      // Успешная регистрация
      toast.success("Регистрация прошла успешно!");

      // Ждём 1.2 секунды и редиректим
      setTimeout(() => {
        navigate("/output", {
          state: { email: form.email },
        });
      }, 1200);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Пользователь с таким email уже существует!");
      } else {
        console.error("Что-то пошло не так, попробуйте снова:", err);
        toast.error("Ошибка регистрации. Попробуйте позже.");
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000} // 3 секунды
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // или "light"/"dark"
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
              Регистрация
            </h2>

            <form
              className="flex flex-col items-center gap-6 w-full"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="fullName"
                placeholder="ФИО"
                value={form.fullName}
                onChange={handleChange}
                className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                autoComplete="name"
              />

              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                autoComplete="username"
              />

              {/* Пароль */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Повторный пароль (только для проверки) */}
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторный пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[48px] px-4 rounded-lg border border-gray-300 text-gray-800"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}

              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition">
                Зарегистрироваться
              </button>
            </form>

            <Link
              className="text-center text-sm text-gray-600 hover:text-gray-800"
              to="/login"
            >
              <u>Уже есть аккаунт? Войти</u>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
