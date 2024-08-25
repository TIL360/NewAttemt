import React, { useContext, useEffect } from 'react';
import userContext from './context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(userContext);

  // Using useEffect to handle side effects (navigation)
  useEffect(() => {
    if (!token) {
      navigate('/login'); // redirect to login if no token
    }
  }, [token, navigate]); // Dependency array to watch token and navigate

  // Don't render the rest of the component if not logged in
  if (!token) {
    return null; // or a loading indicator
  }

  return (
    <>
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Your token: {token}</p> {/* Display token if available */}
     

    </div>
    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <Link className="navbar-brand" to="/">My Application</Link>
 


    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link className="nav-link" to="/">Home </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/registration">Registration</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/studentlist">Students</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
      </li>
        
    </ul>
    

</nav>
    </div>
    </>
  );
};

export default Home;
