import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ManagerPanel from './components/ManagerPanel/ManagerPanel';
import AdminPanel from './components/AdminPanel/AdminPanel';
import EndOfDay from './components/ManagerPanel/EndOfDay';
import UploadExpense from './components/ManagerPanel/UploadExpense';
import UploadStock from './components/ManagerPanel/UploadStock';
import Employees from './components/ManagerPanel/Employees';
import PunchCard from './components/ManagerPanel/PunchCard';
import ShiftSchedule from './components/ManagerPanel/ShiftSchedule';
import AddManager from './components/AdminPanel/AddManager';
import AddEmployee from './components/AdminPanel/AddEmployee';
import ViewShifts from './components/AdminPanel/ViewShifts';
import ViewPunchCards from './components/AdminPanel/ViewPunchCards';
import SalaryEntry from './components/AdminPanel/SalaryEntry';
import RevenueTracking from './components/AdminPanel/RevenueTracking';
import ViewExpenses from './components/AdminPanel/ViewExpenses';
import ViewStockCounts from './components/AdminPanel/ViewStockCounts';
import ViewLosses from './components/AdminPanel/ViewLosses';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/manager" element={<ManagerPanel />} />
                <Route path="/manager/end-of-day" element={<EndOfDay />} />
                <Route path="/manager/upload-expense" element={<UploadExpense />} />
                <Route path="/manager/upload-stock" element={<UploadStock />} />
                <Route path="/manager/employees" element={<Employees />} />
                <Route path="/manager/punch-card" element={<PunchCard />} />
                <Route path="/manager/shift-schedule" element={<ShiftSchedule />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/add-manager" element={<AddManager />} />
                <Route path="/admin/add-employee" element={<AddEmployee />} />
                <Route path="/admin/view-shifts" element={<ViewShifts />} />
                <Route path="/admin/view-punch-cards" element={<ViewPunchCards />} />
                <Route path="/admin/salary-entry" element={<SalaryEntry />} />
                <Route path="/admin/revenue-tracking" element={<RevenueTracking />} />
                <Route path="/admin/view-expenses" element={<ViewExpenses />} />
                <Route path="/admin/view-stock-counts" element={<ViewStockCounts />} />
                <Route path="/admin/view-losses" element={<ViewLosses />} />
            </Routes>
        </Router>
    );
}

export default App;