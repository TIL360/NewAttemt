import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Bars/Dashboard';
import StudentList from './components/students/StudentList';
import StudentCreate from './components/students/StudentCreate';
import StudentEdit from './components/students/StudentEdit';
import AuthProvider from './components/context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import FeeDetail from './components/Fee/FeeDetail';
import FeeCollection from './components/Fee/FeeCollection';
import FeePaid from './components/Fee/FeePaid';
import UnpaidFee from './components/Fee/UnpaidFee';
import Standards from './components/standards/standards';
import Standardedit from './components/standards/standardedit';
import StandardCreate from './components/standards/standardcreate';
import StaffList from './components/Staff/StaffList';
import StaffAdd from './components/Staff/StaffAdd';
import StaffEdit from './components/Staff/StaffEdit';
import Salary from './components/salaries/Salary';
import Leaves from './components/salaries/Leaves';
import Attendance from './components/Attendance/Attendance';
import AttReport from './components/Attendance/AttReport';
import ResultPrep from './components/Result/ResultPrep';
import Result from './components/Result/Result';
import ResultObtMarks from './components/Result/ResultObtMarks';
import PRPdf from './components/Result/PRPdf';
import Payment from './components/Payment/Payment';
import SearchedInvoice from './components/Payment/SearchedInvoice';
import Navbar from './components/Bars/Navbar';
import Registration from './components/Registration';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path='/searchedinvoice/:admNo' element={<SearchedInvoice/>} />
          <Route path='/registration' element={<Registration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } >
            <Route index element={<StudentList />} />
            <Route path="studentlist" element={<StudentList />} />
            <Route path="studentcreate" element={<StudentCreate />} />
            <Route path="studentedit/:id" element={<StudentEdit />} />
            <Route path="feedetail" element={<FeeDetail />} />
            <Route path="feecollection/:idf" element={<FeeCollection />} />
            <Route path="feepaid" element={<FeePaid />} />
            <Route path="unpaidfee" element={<UnpaidFee />} />
            <Route path="standards" element={<Standards />} />
            <Route path="standardedit/:sid" element={<Standardedit />} />
            <Route path="standardcreate" element={<StandardCreate />} />
            <Route path="stafflist" element={<StaffList />} />
            <Route path="staffadd" element={<StaffAdd />} />
            <Route path="staffedit/:staffid" element={<StaffEdit />} />
            <Route path="salary" element={<Salary />} />
            <Route path="leaves/:salaryid" element={<Leaves />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attreport" element={<AttReport />} />
            <Route path="resultprep" element={<ResultPrep />} />
            <Route path="result" element={<Result />} />
            <Route path="resultObtMarks/:resultid" element={<ResultObtMarks />} /> 
            <Route path="PRPdf/:resultid" element={<PRPdf />} />
            
           
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;