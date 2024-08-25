import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";


export default function StudentList() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [students, setStudents] = useState([]);
  const { token } = useContext(userContext);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [token]);

  const handleClick = () => {
    navigate("/studentcreate");
  };

  const handleDelete = async (admNo) => {
    try {
      await axios.delete(`http://localhost:3000/students/${admNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((student) => student.adm_no !== admNo));
      
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (admNo) => {
    navigate(`/studentedit/${admNo}`);
  };

  // Add this function to your StudentList component
const handleInsertFees = async () => {
  try {
      const response = await axios.post('http://localhost:3000/fee/insert-fees', {}, {
          headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Inserted Records: ${response.data.insertedRecords}`);
  } catch (error) {
      console.error('Error inserting fees:', error);
      alert('Failed to insert fees');
  }
};


  return (
    <div className="card">
      <div className="card-header">
      

        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Students Data</h1>
          </div>
          <div className="col-md-6">
            <button className="btn btn-primary" onClick={handleClick}>
              Add New
            </button>
            <button className="btn btn-success mx-2" onClick={handleInsertFees}>
        Generate Invoices
    </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{width:"5%"}}>Id</th>
              <th style={{width:"5%"}}>A.No</th>
              <th style={{width:"30%"}}>Name</th>
              <th style={{width:"10%"}}>Father</th>
              <th style={{width:"1%"}}>Standard</th>
              <th style={{width:"20%"}}>Email</th>
              <th style={{width:"10%"}}>Image</th>
              <th style={{width:"10%"}}>Action</th>
            </tr>
          </thead>
          <tbody>
  {students.map((student) => (
    <tr key={student.id}>
      <td>{student.id}</td>
      <td>{student.adm_no}</td>
      <td>{student.name}</td>
      <td>{student.father}</td>
      <td>{student.standard}</td>
      <td>{student.email}</td>
      <td className="center">
        {student.image && (
          <img
          src={`http://localhost:3000/${student.image}`}  // Assuming the path in the DB is stored as /uploads/imageName.jpg

            alt={student.name}
            style={{ width: "50px", height: "50px" }}  // Adjust size
          />
        )}
      </td>
      <td>
        <button
          className="btn btn-primary"
          onClick={() => handleEdit(student.adm_no)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(student.adm_no)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
