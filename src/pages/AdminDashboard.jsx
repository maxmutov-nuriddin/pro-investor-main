import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../services/Server';

export default function AdminDashboard() {
   const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'users'
   const [operations, setOperations] = useState([]);
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);


   const fetchOperations = () => {
      request.get('/admin/operations', { params: { status: 'pending' } })
         .then((res) => {
            if (Array.isArray(res.data)) setOperations(res.data);
         })
         .catch((err) => {
            console.error(err);
            setError(err.response?.data?.message || "Не удалось загрузить данные.");
         });
   };

   const fetchUsers = () => {
      request.get('/admin/users')
         .then((res) => {
            if (Array.isArray(res.data)) setUsers(res.data);
         })
         .catch((err) => {
            console.error(err);
         })
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchOperations();
      fetchUsers();
   }, []);

   const handleApprove = (id) => {
      request.post(`/admin/operations/${id}/approve`)
         .then((res) => {
            if (res.data.success) {
               alert('Операция одобрена');
               fetchOperations();
            } else {
               alert('Ошибка: ' + res.data.message);
            }
         })
         .catch(err => alert('Ошибка при выполнении запроса'));
   };

   const handleReject = (id) => {
      request.post(`/admin/operations/${id}/reject`)
         .then((res) => {
            if (res.data.success) {
               alert('Операция отклонена');
               fetchOperations();
            } else {
               alert('Ошибка: ' + res.data.message);
            }
         })
         .catch(err => alert('Ошибка при выполнении запроса'));
   };

   const handleRoleUpdate = (id, newRole) => {
      request.patch(`/admin/users/${id}/role`, { role: newRole })
         .then((res) => {
            if (res.data.success) {
               alert('Роль обновлена');
               fetchUsers();
            } else {
               alert('Ошибка: ' + res.data.message);
            }
         })
         .catch(err => alert('Ошибка при обновлении роли'));
   };

   const handleDeleteUser = (id) => {
      if (!window.confirm("Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.")) return;

      request.delete(`/admin/users/${id}`)
         .then((res) => {
            if (res.data.success) {
               alert('Пользователь удален');
               fetchUsers();
            } else {
               alert('Ошибка: ' + res.data.message);
            }
         })
         .catch(err => alert('Ошибка при удалении пользователя'));
   };

   if (loading) return <div className="flex items-center justify-center text-xl p-10">Загрузка панели администратора...</div>;
   if (error) return <div className="flex items-center justify-center text-xl text-red-600 p-10">{error}</div>;

   return (
      <div className="bg-white rounded-lg shadow-lg p-6">
         <h1 className="text-2xl font-bold text-gray-800 mb-6">Панель Администратора</h1>

         <div className="flex gap-4 mb-6 border-b pb-2">
            <button
               onClick={() => setActiveTab('operations')}
               className={`px-4 py-2 font-medium ${activeTab === 'operations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
               Заявки
            </button>
            <button
               onClick={() => setActiveTab('users')}
               className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
               Пользователи
            </button>
         </div>

         {activeTab === 'operations' && (
            <div>
               <h2 className="text-xl font-semibold mb-4">Ожидают подтверждения</h2>
               {operations.length === 0 ? (
                  <p className="text-gray-500">Нет новых заявок.</p>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {operations.map((op) => (
                              <tr key={op.id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.id}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {op.fullName} <br />
                                    <span className="text-gray-500 text-xs">{op.email}</span>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${op.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                       {op.type === 'deposit' ? 'Пополнение' : 'Вывод'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$ {op.amount}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(op.date).toLocaleString()}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                       onClick={() => handleApprove(op.id)}
                                       className="text-green-600 hover:text-green-900 mr-4"
                                    >
                                       Одобрить
                                    </button>
                                    <button
                                       onClick={() => handleReject(op.id)}
                                       className="text-red-600 hover:text-red-900"
                                    >
                                       Отклонить
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         )}

         {activeTab === 'users' && (
            <div>
               <h2 className="text-xl font-semibold mb-4">Список пользователей</h2>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действие</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                           <tr key={u.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.fullName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {u.role}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                 {u.role === 'user' ? (
                                    <>
                                       <button
                                          onClick={() => handleRoleUpdate(u.id, 'admin')}
                                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                                       >
                                          Сделать Admin
                                       </button>
                                       <button
                                          onClick={() => handleDeleteUser(u.id)}
                                          className="text-red-600 hover:text-red-900"
                                       >
                                          Удалить
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <button
                                          onClick={() => handleRoleUpdate(u.id, 'user')}
                                          className="text-gray-600 hover:text-gray-900 mr-3"
                                       >
                                          Разжаловать
                                       </button>
                                       {/* Optional: allow deleting other admins? Check backend logic (self-delete prevented) */}
                                       <button
                                          onClick={() => handleDeleteUser(u.id)}
                                          className="text-red-600 hover:text-red-900"
                                       >
                                          Удалить
                                       </button>
                                    </>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   );
}
