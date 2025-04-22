import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Mapa3D from '../components/Mapa3D';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import CustomCarousel from '../components/CustomCarousel';

const Home = () => {
  return (
    <CustomContainer>
      <section className="about-section">
        <ContentWrapper>
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
            <div className="img-content gallery-img">
              <img className="about-img" src="/images/bg.png" alt="Huerto" />
            </div>
          </div>
        </ContentWrapper>
      </section>

      <section className="gallery-section">
        <ContentWrapper>
          <h1 className="section-title">Un vistazo a los huertos...</h1>
          <hr className="section-divider" />
          <CustomCarousel images={[
            "/images/huertos-1.jpg",
            "/images/huertos-2.jpg",
            "/images/huertos-3.jpg",
            "/images/huertos-4.jpg",
            "/images/huertos-5.jpg",
            "/images/huertos-6.jpg"
          ]} />
        </ContentWrapper>
      </section>

      <section className="map-section">
        <ContentWrapper>
          <h1 className='section-title'>Dónde estamos</h1>
          <hr className='section-divider' />
          <div className="embed-responsive embed-responsive-16by9 col-sm-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d852.9089299216993!2d-5.964801462716831!3d37.32821983433692!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2ses!4v1719902018700!5m2!1ses!2ses"
              style={{ width: '100%', height: '60vh', border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del huerto"
              className='rounded-4'
            ></iframe>
          </div>
        </ContentWrapper>
      </section>
    </CustomContainer>
  );
};

export default Home;
