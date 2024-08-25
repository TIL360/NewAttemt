import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentList from "./components/students/StudentList";
import StudentCreate from "./components/students/StudentCreate";
import Home from "./components/Home"; // Your Home component
import Login from "./components/Login";
import Registration from "./components/Registration";
import AuthProvider from "./components/context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Dashboard from "./components/Bars/Dashboard";
import StudentEdit from "./components/students/StudentEdit";


const App = () => {
  return (
    <>
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
         
   
          <Route path="/studentedit/:id" element={<StudentEdit />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/registration"
            element={
              <ProtectedRoute>
                <Registration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studentlist"
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studentcreate"
            element={
              <ProtectedRoute>
                <StudentCreate />
              </ProtectedRoute>
            }
          />
         
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;
