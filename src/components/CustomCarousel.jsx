import Slider from 'react-slick';

const CustomCarousel = ({ images }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <div className="my-4">
            <Slider {...settings}>
                {images.map((src, index) => (
                    <div key={index} className='p-3'>
                        <img
                            src={src}
                            alt={`slide-${index}`}
                            style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CustomCarousel;
