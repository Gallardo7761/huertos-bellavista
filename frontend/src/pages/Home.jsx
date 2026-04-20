import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import CustomCarousel from '../components/CustomCarousel';
import Mapa from '../components/Mapa';

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
                Si quieres unirte a nuestra comunidad, tenemos una <strong>lista de espera</strong> y un sistema de 
                <strong> solicitudes de alta</strong> que puedes ver {' '} <Link to="/lista-espera" className="link">aquí</Link>.
                No dudes en ponerte en contacto con nosotros a través de nuestro correo electrónico para cualquier duda. 
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
          <Mapa lat={37.3282} lng={-5.9648} />
        </ContentWrapper>
      </section>
    </CustomContainer>
  );
};

export default Home;
