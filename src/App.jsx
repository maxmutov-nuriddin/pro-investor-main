import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Output from "./pages/Output";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layouts/Layout";
import Bills from "./pages/Bills";
import History from "./pages/History";
import Register from "./pages/Register";
import Replenish from "./pages/Replenish";
import AccountTopUp from "./pages/AccountTopUp";
import WithdrawMoney from "./pages/WithdrawMoney";
import Transfer from "./pages/Transfer";
import ProfileForm from "./pages/ProfileForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/output" element={<Output />} />
      <Route path="/help" element={<Help />} />

      <Route path="/dashboard" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bills" element={<Bills />} />
        <Route path="history" element={<History />} />
        <Route path="replenish" element={<Replenish />} />
        <Route path="accountTopUp" element={<AccountTopUp />} />
        <Route path="withdrawMoney" element={<WithdrawMoney />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="account" element={<ProfileForm />} />

        {/* Admin Route Nested in Dashboard */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
