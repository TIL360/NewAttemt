import React from 'react';
import { Link } from 'react-router-dom';
import image1 from './Images/image1.JPG';  // Use the actual name on disk



const Home = () => {
  return (
    <div>
      <h1 className='text-center'>Welcome to the TECH INFO !</h1>


      <nav class="navbar navbar-expand-lg navbar-light bg-light">

  <Link class="navbar-brand" to="#">TECHINFO</Link>
  <button
  className="navbar-toggler"
  type="button"
  data-toggle="collapse"
  data-target="#navbarNav"
  aria-controls="navbarNav"
  aria-expanded="false"
  aria-label="Toggle navigation"
  onClick={() => {
    const navbarNav = document.getElementById('navbarNav');
    navbarNav.classList.toggle('collapse');
  }}
>
  <span className="navbar-toggler-icon"></span>
</button> 

  <div className='navbar' id="navbarNav">
    <ul className="navbar-nav">
    <li className="nav-item active">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/feeindex">
              Online Payment
            </Link>
          </li>
    </ul>
  </div>
</nav>


      
      {/* Image Slider */}
      <div id="carouselExample" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={image1} className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src={image1} className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src={image1} className="d-block w-100" alt="Slide 3" />
          </div>
        </div>
        <Link className="carousel-control-prev" to="#carouselExample" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </Link>
        <Link className="carousel-control-next" to="#carouselExample" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </Link>
      </div>

      {/* Two parallel divs for additional content */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="p-3 border bg-light">
              <h2 className='text-center'>Do You Know About SPA?</h2>
              <p className='text-justify'>A Single Page Application (SPA) is a type of web application designed to enhance user experience by loading a single HTML page and dynamically updating its content without the need for full page reloads. Utilizing modern web technologies, SPAs facilitate smooth interactions, allowing users to engage with applications in a more responsive manner. Key features of SPAs include dynamic content loading via AJAX, which permits real-time updates to the interface, and improved performance by reducing server load and enhancing load times. They also provide a rich user experience by supporting smooth transitions and interactive elements, as well as client-side routing, enabling seamless navigation between different views without page reloads. However, SPAs come with considerations such as potentially slower initial load times due to larger JavaScript downloads, challenges in search engine optimization (SEO) due to dynamically loaded content, and the need for careful management of browser history and URL routing for consistent navigability. Popular frameworks that support SPA development include React, Angular, Vue.js, and Ember.js, each offering various tools and capabilities to streamline the building of these engaging applications.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border bg-light">
              <h2>Content Block 2</h2>
              <p>This is some content for the second block. You can add more information here as well.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
