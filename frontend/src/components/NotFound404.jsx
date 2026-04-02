import { Link, useNavigate } from 'react-router-dom';

import CustomContainer from './CustomContainer.jsx';
import ContentWrapper from './ContentWrapper.jsx';

const NotFound404 = () => {
    const navigate = useNavigate();

    return (
        <CustomContainer>
            <ContentWrapper>
                <section
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: '70vh' }}
                >
                    <div
                        className="position-relative overflow-hidden text-center rounded-5 shadow p-4 p-md-5"
                        style={{
                            maxWidth: '760px',
                            width: '100%',
                            background: 'linear-gradient(160deg, var(--card-bg) 0%, var(--bg-color) 100%)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--box-shadow-soft)',
                        }}
                    >
                        <div className="position-relative d-flex flex-column gap-4">
                            <div className="d-flex flex-column gap-2 align-items-center">
                                <div>
                                    <h1
                                        className="mb-0 fw-bold"
                                        style={{
                                            fontSize: 'clamp(4rem, 14vw, 8rem)',
                                            lineHeight: '0.95',
                                            color: 'var(--primary-color)',
                                            textShadow: '0 10px 30px var(--shadow-color)',
                                        }}
                                    >
                                        404
                                    </h1>
                                    <p className="mb-0 mt-3 fs-4 fw-semibold" style={{ color: 'var(--fg-color)' }}>
                                        No hemos encontrado esta página.
                                    </p>
                                </div>
                            </div>

                            <p className="mx-auto mb-0" style={{ maxWidth: '52ch', color: 'var(--muted-color)' }}>
                                Puede que el enlace esté roto, la dirección haya cambiado o la página ya no exista.
                                Vuelve al inicio para seguir navegando por la web.
                            </p>

                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 pt-2">
                                <Link
                                    to="/"
                                    className="btn btn-lg rounded-4 px-4 border-0"
                                    style={{
                                        backgroundColor: 'var(--btn-bg)',
                                        color: 'var(--btn-text)',
                                        boxShadow: 'var(--box-shadow-soft)',
                                    }}
                                >
                                    Volver al inicio
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-lg rounded-4 px-4"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'var(--secondary-color)',
                                        border: '1px solid var(--border-color)',
                                    }}
                                >
                                    Ir atrás
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </ContentWrapper>
        </CustomContainer>
    );
};

export default NotFound404;