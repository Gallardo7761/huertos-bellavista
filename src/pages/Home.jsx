import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  return (
    <main className="home-container">
      <section className="about-section">
        <div className="content-wrapper">
          <h1 className="section-title">Sobre nosotros</h1>
          <hr className="section-divider" />
          <div className="about-content">
            <div className="text-content">
              <p>
                Nos dedicamos a cultivar una variedad de frutas y verduras, promoviendo la sostenibilidad,
                la vida saludable y la convivencia entre los hortelanos. Nuestra comunidad está compuesta
                por vecinos apasionados por la jardinería, el medio ambiente y la creación de zonas verdes en la ciudad.
              </p>
              <p>
                Cada hortelano dispone de una parcela y puede optar a una parcela dentro del invernadero. Dentro
                de las zonas comunes disponemos de árboles frutales.
              </p>
              <p>
                Si te quieres unir a nuestra comunidad, no dudes en ponerte en contacto con nosotros a través de
                nuestro correo electrónico para cualquier duda. Ten en cuenta que existe una lista de espera que puedes ver{' '}
                <Link to="/lista-espera">aquí</Link> y si lo prefieres, puedes mandar una{' '}
                <Link to="/alta">solicitud de alta</Link>.
              </p>
            </div>
            <div className="img-content">
              <img className="about-img" src="/images/bg.png" alt="Huerto" />
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="content-wrapper">
          <h1 className="section-title">Un vistazo a los huertos...</h1>
          <hr className="section-divider" />
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <a href={`/images/huertos-${n}.jpg`} data-lightbox="huertos" data-title={`Huerto ${n}`} key={n}>
                <img className="gallery-img" src={`/images/huertos-${n}.jpg`} alt={`Huerto ${n}`} />
              </a>
            ))}
            <a href="/images/bg.png" data-lightbox="huertos" data-title="Huerto 7">
              <img className="gallery-img" src="/images/bg.png" alt="Huerto 7" />
            </a>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="content-wrapper">
          <h1 className="section-title">Donde estamos</h1>
          <hr className="section-divider" />
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d852.9089299216993!2d-5.964801462716831!3d37.32821983433692!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2ses!4v1719902018700!5m2!1ses!2ses"
              title="Mapa de Huertos Bellavista"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
