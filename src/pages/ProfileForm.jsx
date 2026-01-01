import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import request from "../services/Server";

export default function ProfileForm() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("trading");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // форма профиля
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    passport: "",
    issuedBy: "",
    issuedDate: "",
    code: "",
    gender: "",
    birthDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // форма смены пароля
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });

  // ✅ Загрузка данных с API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await request.get("/users/me");

        // ❗ всегда подставляем пустую строку, если undefined
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          email: data.email || "",
          passport: data.passport || "",
          issuedBy: data.issuedBy || "",
          issuedDate: data.issuedDate || "",
          code: data.code || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
        });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Ошибка при загрузке профиля");
      }
    };
    fetchUser();
  }, []);

  // ✅ Обновление профиля
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log("test");

      await request.patch("/users/me", formData);
      toast.success("Данные успешно обновлены!");
      setIsEditing(false);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Ошибка при сохранении");
    }
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      toast.warn("Пароль слишком короткий (мин. 8 символов)");
      return;
    }

    if (form.newPassword !== confirmPassword) {
      return setError("Пароли не совпадают!");
    }

    try {
      await request.patch("/users/me", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Пароль успешно изменён!");
      setShowModal(false);
      setForm({ currentPassword: "", newPassword: "" });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Ошибка при смене пароля");
    }
  };

  return (
    <>
      {" "}
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
      <div className="max-w-2xl mx-auto p-6">
        {/* Заголовок */}
        <h1 className="text-2xl font-bold mb-4">{formData.fullName}</h1>

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
            Персональные данные
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 font-medium ${
              activeTab === "bank"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Настройки
          </button>
        </div>
        {/* Content */}
        {activeTab === "trading" ? (
          <>
            {/* Карточка */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl shadow-sm space-y-6"
            >
              {/* Персональные данные */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <h2 className="text-lg font-semibold">Персональные данные</h2>
                  <button
                    type="button"
                    className="text-blue-500 text-sm hover:underline self-start sm:self-auto"
                    onClick={() => {
                      if (isEditing) {
                        handleSubmit(); // работает только при "Сохранить"
                      } else {
                        setIsEditing(true); // включает режим редактирования
                      }
                    }}
                  >
                    {isEditing ? "Сохранить" : "Редактировать"}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* ФИО */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">ФИО</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Введите ФИО"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Телефон */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Мобильный телефон</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+998..."
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="example@mail.com"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>
                </div>
              </div>

              {/* Паспортные данные */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Паспортные данные
                </h2>

                <div className="space-y-4">
                  {/* Серия и номер паспорта */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Серия и номер</label>
                    <input
                      type="text"
                      name="passport"
                      value={formData.passport}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="AA1234567"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Кем выдан */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Кем выдан</label>
                    <input
                      type="text"
                      name="issuedBy"
                      value={formData.issuedBy}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Организация"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Дата выдачи */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Дата выдачи</label>
                    <input
                      type="date"
                      name="issuedDate"
                      value={formData.issuedDate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black"
                    />
                  </div>

                  {/* Код подразделения */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Код подразделения</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="000-000"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Пол */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Пол</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="М/Ж"
                      className="mt-1 sm:mt-0 sm:text-right outline-none bg-transparent disabled:text-black w-full sm:w-1/2"
                    />
                  </div>

                  {/* Дата рождения */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 py-2">
                    <label className="text-gray-500">Дата рождения</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="дд.мм.гггг"
                      className="mt-1 sm:mt-0 text-right outline-none bg-transparent disabled:text-black [text-align-last:right]"
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="p-4">
            {/* Блок с настройками */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800">Настройки входа</h3>
              <p className="text-gray-600 mb-2">Вход по паролю</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Изменить пароль
              </button>
            </div>

            {/* Модальное окно */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-[#000000ba] bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                  <h2 className="text-lg font-semibold mb-4">Сменить пароль</h2>
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    {/* Текущий пароль */}
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Текущий пароль"
                        value={form.currentPassword}
                        onChange={handleChangePassword}
                        required
                        className="w-full border rounded p-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((p) => ({
                            ...p,
                            current: !p.current,
                          }))
                        }
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.current ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>

                    {/* Новый пароль */}
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        placeholder="Новый пароль"
                        value={form.newPassword}
                        onChange={handleChangePassword}
                        required
                        minLength={8}
                        maxLength={32}
                        className="w-full border rounded p-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((p) => ({ ...p, new: !p.new }))
                        }
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.new ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Повторите новый пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={32}
                        className="w-full border rounded p-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((p) => ({ ...p, new: !p.new }))
                        }
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword.new ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-500">
                      Длина пароля — от 8 до 32 символов.
                    </p>

                    {error && (
                      <p className="text-red-600 text-sm font-medium">
                        {error}
                      </p>
                    )}

                    {/* Кнопки */}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Отменить
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitPassword} // только тут вызываем функцию
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
