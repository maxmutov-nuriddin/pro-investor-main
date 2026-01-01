import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

const Output = ({ length = 6, initialTimer = 90 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const maskedValue = email
    ? email.replace(/(.{2}).+(@.+)/, "$1****$2")
    : "hidden@email.com";

  const [otp, setOtp] = useState(Array(length).fill(""));
  const [timer, setTimer] = useState(initialTimer);
  const codeSent = useRef(false); // флажок защиты от двойного вызова

  useEffect(() => {
    if (!email) {
      navigate("/login");
    } else if (!codeSent.current) {
      sendCode();
      codeSent.current = true; // больше не вызовется повторно
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = async (code) => {
    try {
      const res = await request.post("/auth/verify-user", {
        email,
        code,
      });

      // если backend возвращает токен
      if (res.data?.token) {
        Cookies.set("TOKEN", res.data.token, { expires: 7 });
      }

      toast.success("Регистрация прошла успешно!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Пользователь с таким email уже существует!");
      } else {
        console.error("Ошибка:", err);
        toast.error("Ошибка регистрации. Попробуйте позже.");
      }
    }
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        handleVerify(newOtp.join(""));
      }
    }
  };

  // const sendCode = () => {
  //   // const code = Math.floor(100000 + Math.random() * 900000);
  //   // localStorage.setItem("authCode", code);
  //   // localStorage.setItem("authEmail", email);

  //   // toast.info(`Ваш код: ${code}`);

  //   setOtp(Array(length).fill(""));
  //   setTimer(initialTimer);
  //   setTimeout(() => {
  //     document.getElementById("otp-0")?.focus();
  //   }, 100);
  // };

  const sendCode = () => {
    setOtp(Array(length).fill(""));
    setTimer(initialTimer);

    // ✅ уведомление именно здесь
    toast.info(`📩 Код отправлен на ${maskedValue}`);

    setTimeout(() => {
      document.getElementById("otp-0")?.focus();
    }, 100);
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
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer">
            <span className="text-xl">←</span>
            <button
              onClick={() => navigate("/login")}
              className="hover:underline"
            >
              Указать другой e-mail
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-center">
            Введите код из письма
          </h2>

          <p className="text-gray-600 text-center text-sm">
            Отправили на <span className="font-medium">{maskedValue}</span>
          </p>

          <div className="flex justify-center gap-1 md:gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-9 h-9 sm:w-14 sm:h-14 text-center text-xl font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}
          </div>

          {timer > 0 ? (
            <p className="text-gray-500 text-center text-sm">
              Запросить новый код можно через <span>{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={sendCode}
              className="text-red-600 text-sm hover:underline"
            >
              Запросить новый код
            </button>
          )}

          <Link
            to="/help"
            className="text-gray-600 text-sm underline hover:text-gray-800 text-center"
          >
            Не получил код
          </Link>
        </div>
      </div>
    </>
  );
};

export default Output;
