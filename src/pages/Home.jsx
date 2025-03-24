import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="row p-0 m-0">
      <section className="col-sm-12 row justify-content-center mt-5 mb-5 m-0 p-0">
        <article className="row col-sm-10 mb-3">
          <div className="col-sm-12">
            <h1>Sobre nosotros</h1>
            <hr />
          </div>
          <div className="col-lg-9" style={{ fontSize: '20px' }}>
            <p>
              Nos dedicamos a cultivar una variedad de frutas y verduras, promoviendo la sostenibilidad,
              la vida saludable y la convivencia entre los hortelanos. Nuestra comunidad está compuesta
              por vecinos apasionados por la jardinería, el medio ambiente y la creación de zonas verdes
              en la ciudad.
            </p>
            <p>
              Cada hortelano dispone de una parcela y puede optar a una parcela dentro del invernadero. Dentro
              de las zonas comunes disponemos de árboles frutales.
            </p>
            <p>
              Si te quieres unir a nuestra comunidad, no dudes en ponerte en contacto con nosotros a través de
              nuestro correo electrónico para cualquier duda. Debes tener en cuenta que existe una lista de espera
              la cual puedes mirar <Link to="/lista-espera">aquí</Link> y si quieres, puedes mandar una <Link to="/alta">solicitud de alta</Link>.
            </p>
          </div>
          <div className="col-lg-3">
            <img className="img-fluid rounded" src="/images/bg.png" alt="huertos" />
          </div>
        </article>

        <article className="row col-sm-10 mt-sm-5 mb-3">
          <div className="col-sm-12">
            <h1>Un vistazo a los huertos...</h1>
            <hr />
          </div>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="col-lg-3 mb-4" key={n}>
              <a href={`/images/huertos-${n}.jpg`} data-lightbox="huertos" data-title={`Huerto ${n}`}>
                <img className="img-fluid rounded" src={`/images/huertos-${n}.jpg`} alt={`Huerto ${n}`} />
              </a>
            </div>
          ))}
          <div className="col-lg-3 mb-4">
            <a href="/images/bg.png" data-lightbox="huertos" data-title="Huerto 7">
              <img className="img-fluid rounded" src="/images/bg.png" alt="Huerto 7" />
            </a>
          </div>
        </article>

        <article className="row col-sm-10 mt-sm-5 mb-3">
          <div className="col-sm-12">
            <h1>Donde estamos</h1>
            <hr />
          </div>
          <div className="embed-responsive embed-responsive-16by9 col-sm-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d852.9089299216993!2d-5.964801462716831!3d37.32821983433692!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2ses!4v1719902018700!5m2!1ses!2ses"
              style={{ width: '100%', height: '60vh', border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Huertos Bellavista"
            ></iframe>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Home;