import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import request from '../services/Server';

export default function AdminRoute({ children }) {
   const token = localStorage.getItem('token');
   const [loading, setLoading] = useState(true);
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      if (!token) {
         setLoading(false);
         return;
      }

      const verifyAdmin = async () => {
         try {
            // Fetch fresh user data from server
            const { data } = await request.get('/users/me');
            // Update localStorage to keep it in sync
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'admin') {
               setIsAdmin(true);
            } else {
               setIsAdmin(false);
            }
         } catch (error) {
            console.error("Admin verification failed", error);
            setIsAdmin(false);
         } finally {
            setLoading(false);
         }
      };

      verifyAdmin();
   }, [token]);

   if (!token) {
      return <Navigate to="/login" replace />;
   }

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-xl font-semibold text-gray-600">Проверка прав доступа...</div>
         </div>
      );
   }

   if (isAdmin) {
      return children;
   }

   return <Navigate to="/dashboard" replace />;
}
