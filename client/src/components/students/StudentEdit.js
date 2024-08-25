import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import userContext from "../context/UserContext";

export default function StudentEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState({
        adm_no: "",
        name: "",
        standard: "",
        image: "",
        monthly_fee: "",
        status: "",
        father: "",
        adm_date: "",
        adm_standard: "",
        mobile: "",
        address: "",
        email: ""
    });
    const [newImage, setNewImage] = useState(null);
    const [standards, setStandards] = useState([]);
    const { token } = useContext(userContext);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                console.log("Fetched student data:", response.data);
                setStudent(response.data);
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };

        const fetchStandards = async () => {
            try {
                const response = await axios.get('http://localhost:3000/classes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data); // Check what data you're receiving
                setStandards(response.data); // Set standards to state
            } catch (err) {
                console.error("Error fetching standards:", err);
            }
        };

        fetchStudent();
        fetchStandards();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
  
      // Append updated data to formData
      formData.append('admno', student.adm_no);
      formData.append('name', student.name);
      formData.append('standard', student.standard);
      formData.append('monthly_fee', student.monthly_fee);
      formData.append('status', student.status);
      formData.append('father', student.father);
      formData.append('adm_date', student.adm_date);
      formData.append('adm_standard', student.adm_standard);
      formData.append('mobile', student.mobile);
      formData.append('address', student.address);
      formData.append('email', student.email);
  
      if (newImage) {
          formData.append('image', newImage); // Append new image if available
      }
  
      try {
          await axios.patch(`http://localhost:3000/students/${id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              }
          });
  
          // Pass state while navigating
          navigate('/studentlist', { state: { message: 'Student updated successfully!' } });
      } catch (error) {
          console.error("Error updating student:", error);
      }
  };
  
    return (
        <div className="card">
            <div className="card-header">
                <h1>Edit Student</h1>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="adm_no" className="form-label">Admission Number</label>
                        <input type="text" className="form-control" id="adm_no" name="adm_no" value={student.adm_no} onChange={handleChange} disabled />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={student.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="standard" className="form-label">Standard</label>
                        <select
                            className="form-select"
                            id="standard"
                            name="standard"
                            value={student.standard}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Standard...</option>
                            {standards.map((std) => (
                                <option key={std.sid} value={std.standard}>
                                    {std.standard}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="monthly_fee" className="form-label">Monthly Fee</label>
                        <input type="text" className="form-control" id="monthly_fee" name="monthly_fee" value={student.monthly_fee} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <input type="text" className="form-control" id="status" name="status" value={student.status} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="father" className="form-label">Father's Name</label>
                        <input type="text" className="form-control" id="father" name="father" value={student.father} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="adm_date" className="form-label">Admission Date</label>
                        <input type="date" className="form-control" id="adm_date" name="adm_date" value={student.adm_date} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="adm_standard" className="form-label">Admission Standard</label>
                        <select
                            className="form-select"
                            id="adm_standard"
                            name="adm_standard"
                            value={student.adm_standard}
                            onChange={handleChange}
                        >
                            <option value="">Select Admission Standard...</option>
                            {standards.map((std) => (
                                <option key={std.sid} value={std.standard}>
                                    {std.standard}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Mobile</label>
                        <input type="text" className="form-control" id="mobile" name="mobile" value={student.mobile} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address" name="address" value={student.address} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={student.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Image</label>
                        <input
                            className="form-control"
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                        />
                        {student.image && (
                            <img src={`http://localhost:3000/${student.image}`} alt={student.name} style={{ width: "100px", height: "100px" }} />
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">Update Student</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/studentlist')}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
