import Cookies from "js-cookie";
import {
  Home,
  CreditCard,
  Clock,
  LogOut,
  PlusCircle,
  Wallet,
  Settings,
  ArrowRightLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import request from "../services/Server";
import { toast } from "react-toastify";

export default function Layout() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let retryTimeout;

    const fetchUser = async (isRetry = false) => {
      try {
        const { data } = await request.get("/users/me");
        setData(data);
        // FORCE UPDATE LOCAL STORAGE
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        if (err.response?.status === 401) {
          if (!isRetry) {
            toast.warn("Нет доступа. Попробуем ещё раз через 30 секунд...");
            retryTimeout = setTimeout(() => fetchUser(true), 30000);
          } else {
            toast.error("Сессия истекла, войдите снова");
            Cookies.remove("TOKEN");
            navigate("/login");
          }
        } else {
          toast.error("Ошибка при загрузке профиля");
        }
      }
    };

    fetchUser();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("TOKEN");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="m-6 flex items-center justify-between ">
        <Link to="/dashboard/dashboard">
          <img src="/header.svg" alt="logo" />
        </Link>
        <div className="flex items-center gap-3">
          <NavLink
            to="/dashboard/account"
            className={({ isActive }) =>
              `p-2 rounded flex items-center justify-center 
         ${isActive ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`
            }
          >
            <Settings className="w-6 h-6" />
          </NavLink>
          <span className="bg-[#D3D3D3] w-[2px] h-[30px]"></span>
          <div className="text-left text-right">
            <p className="font-semibold text-base sm:text-lg text-sm">
              {data.fullName}
            </p>
            <p className="text-xs sm:text-sm text-sm text-gray-500">
              Квалифицированный <br /> управляющий
            </p>
          </div>

          <span className="bg-[#D3D3D3] w-[2px] h-[30px]"></span>
          <LogOut
            className="w-6 h-6 text-red-500 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 mx-4 mb-4 rounded-xl hidden md:block ">
          <div className="flex flex-col justify-between h-[100%]">
            <nav className="space-y-2 ">
              <NavLink
                to="/dashboard/dashboard"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 rounded-lg ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <Home className="w-5 h-5 mr-2" /> Главная
              </NavLink>

              <NavLink
                to="/dashboard/bills"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 rounded-lg ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <CreditCard className="w-5 h-5 mr-2" /> Счета
              </NavLink>

              <NavLink
                to="/dashboard/history"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 rounded-lg ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <Clock className="w-5 h-5 mr-2" /> История
              </NavLink>
            </nav>

            <div className="mt-6 space-y-2">
              {data.role === 'admin' && (
                <NavLink
                  to="/dashboard/admin"
                  className={({ isActive }) => `flex items-center w-full px-3 py-2 border rounded-lg hover:bg-purple-50 text-purple-600 border-purple-200 ${isActive ? 'bg-purple-100' : ''}`}
                >
                  <Settings className="w-5 h-5 mr-2" /> Админ Панель
                </NavLink>
              )}

              <NavLink
                to="transfer"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 border rounded-lg hover:bg-gray-50 ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <ArrowRightLeft className={`w-5 h-5 mr-2`} /> Перевод
              </NavLink>
              <NavLink
                to="withdrawMoney"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 border rounded-lg hover:bg-gray-50 ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <Wallet className={`w-5 h-5 mr-2`} /> Вывести деньги
              </NavLink>
              <NavLink
                to="replenish"
                className={({ isActive }) =>
                  `flex items-center w-full px-3 py-2 border rounded-lg hover:bg-gray-50 ${isActive ? "bg-red-500 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Пополнить баланс
              </NavLink>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-1 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center p-2 md:hidden">
        <NavLink
          to="/dashboard/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Главная</span>
        </NavLink>

        <NavLink
          to="/dashboard/bills"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <CreditCard className="w-6 h-6" />
          <span className="text-xs">Счета</span>
        </NavLink>

        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs">История</span>
        </NavLink>

        <NavLink
          to="/dashboard/transfer"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <ArrowRightLeft className="w-6 h-6" />
          <span className="text-xs">Перевод</span>
        </NavLink>

        <NavLink
          to="/dashboard/withdrawMoney"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs">Вывести</span>
        </NavLink>
      </nav>
    </div>
  );
}
