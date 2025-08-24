 import React from 'react';
import { Link } from 'react-router-dom';

import zyravideo from  "../assets/zyravideo.mp4"

function Home() {
  return (
  <div className='mt-5'>
      <div className='mt-5'>
      
    <div 
  id="carouselExampleAutoplaying" 
  className="carousel slide carousel-fade" 
  data-bs-ride="carousel"
  data-bs-interval="3000"
>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <Link to="/products">
        <img 
 src="https://www.selectedhomme.in/cdn/shop/files/1800x773_px_Everyday-essentials-Selected-Desktop.jpg?v=1754049684&width=1800"
          className="d-block w-100" 
          alt="Banner 1" 
        />
      </Link>
    </div>
    <div className="carousel-item">
      <Link to="/products">
        <img 
          src="https://www.selectedhomme.in/cdn/shop/files/Hero_Banner_1800x773_7a76fa74-f45a-4c0a-aa0c-d369342a3440.png?v=1754638939&width=1800" 
          className="d-block w-100" 
          alt="Banner 2"
        />
      </Link>
    </div>
    <div className="carousel-item">
      <Link to="/products">
        <img 
          src="https://www.selectedhomme.in/cdn/shop/files/1800x773_px_New-arrivals-Selected-Home-page.jpg?v=1753321224&width=1800" 
          className="d-block w-100" 
          alt="Banner 3"
        />
      </Link>
    </div>
  </div>

  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>






      
      <div className="container mt-5">
        <h1 className="text-center mb-5" style={{color:"red"}}>CATEGORIES</h1>
        <div className="row">
          <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/Shirts.png?v=1754637526&width=800" 
                className="card-img-top" 
                alt="Stylish T-Shirt"
              />
              <div className="card-body text-center">
               <Link to="/products/category/Shirt" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>

          {/* Category 2 */}
          <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/T-Shirts.png?v=1754637572&width=800" 
                className="card-img-top" 
                alt="Cool Jacket"
              />
              <div className="card-body text-center">
               <Link to="/products/category/T-shirt" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>                    
          <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/Jackets.png?v=1754637593&width=800" 
                className="card-img-top" 
                alt="Classic Jeans"
              />
              <div className="card-body text-center">
              <Link to="/products/category/Jacket" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>

      
                      <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/Tailoring_19a77150-c9d7-4718-9ebf-2e3478c1728e.png?v=1754637676&width=800" 
                className="card-img-top" 
                alt="coat"
              />
              <div className="card-body text-center">
              <Link to="/products/category/Coat" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>

                    <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/Knitwear.png?v=1754637712&width=800" 
                className="card-img-top" 
                alt="Knitwear"
              />
              <div className="card-body text-center">
              <Link to="/products/category/Knitwear" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>

          
                    <div className="col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="https://www.selectedhomme.in/cdn/shop/files/Check_Shirt.png?v=1754637181&width=800" 
                className="card-img-top" 
                alt="Check-shirt"
              />
              <div className="card-body text-center">
              <Link to="/products/category/Check-shirt" className="btn btn-outline-primary">Shop Now</Link>

              </div>
            </div>
          </div>

       

        </div>
      </div>
{/* About Us Section */}
<div className="about container mt-5 pt-5 mb-5" >
  <div className="row align-items-center" style={{backgroundColor:"black" ,color:"white"}} >
    {/* Left side - text */}
    <div className="col-md-6">
      <h1 className="mb-4" >About Us</h1>
      <p className="fw-bold" >
        At Zyra, we believe style is more than just clothing—it’s an expression of confidence. 
        We are a premium fashion brand dedicated to crafting high-quality t-shirts, shirts, 
        and jackets for men who appreciate comfort without compromising on elegance.
        <br /><br />
        Our collections are designed with attention to detail, blending timeless style with modern trends. 
        Every piece is made using premium fabrics to ensure durability, comfort, and a perfect fit.
        <br /><br />
        Zyra isn’t just about looking good—it’s about feeling good in what you wear. 
        Whether it’s a classic shirt for a formal occasion, a sleek jacket for evenings out, 
        or a casual t-shirt for everyday wear, Zyra has you covered.
        <br /><br />
        Step into the world of premium menswear with Zyra—where fashion meets sophistication.
      </p>
    </div>

    {/* Right side - Local video */}
   {/* Right side - Local video */}
<div className="col-md-6 text-center">
  <div style={{ maxWidth: "400px", margin: "0 auto" }}>
    <video 
      src={zyravideo} 
      style={{ width: "100%", height: "auto", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
      controls 
      autoPlay 
      loop 
      muted 
    />
  </div>
</div>

  </div>
</div>



    </div>
  </div>
  );
}

export default Home;
