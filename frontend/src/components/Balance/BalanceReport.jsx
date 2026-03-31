import { useState } from 'react';
import { Card, Button, Row, Col, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPiggyBank,
  faCoins,
  faArrowDown,
  faArrowUp,
  faClock,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import PDFModal from '../PDFModal';
import { BalancePDF } from './BalancePDF';
import { format } from 'date-fns';
import '../../css/BalanceReport.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const BalanceReport = ({ balance, years, selectedYear, onYearChange }) => {
  const [showPDF, setShowPDF] = useState(false);

  const showPDFModal = () => setShowPDF(true);
  const closePDFModal = () => setShowPDF(false);

  const {
    initialBank,
    initialCash,
    totalBankExpenses,
    totalCashExpenses,
    totalBankIncomes,
    totalCashIncomes,
    createdAt
  } = balance;

  const finalBank = initialBank + totalBankIncomes - totalBankExpenses;
  const finalCash = initialCash + totalCashIncomes - totalCashExpenses;

  return (
    <>
      <Container className="my-4">
        <Card className="balance-report px-4 py-5">
          <Row className="align-items-center justify-content-between mb-4">
            <Col xs="12" md="auto" className="text-center text-md-start mb-3 mb-md-0">
              <h1 className="report-title m-0">📊 Informe de Balance</h1>
            </Col>
            <Col xs="12" md="auto" className="text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-2">
                <Button
                  className="print-btn d-flex align-items-center btn-danger"
                  onClick={showPDFModal}
                  style={{ height: '38px' }}
                >
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Exportar
                </Button>
                <Form.Select
                  className="themed-input m-0"
                  size="sm"
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  style={{
                    maxWidth: '100px',
                    height: '38px',
                    cursor: 'pointer'
                  }}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Form.Select>
              </div>
            </Col>
          </Row>

          <Row className="gy-4">
            <Col md={6}>
              <div className="balance-box">
                <h4><FontAwesomeIcon icon={faPiggyBank} className="me-2" />Banco</h4>
                <p>Saldo inicial: <span className="balance-value">{formatCurrency(initialBank)}</span></p>
                <p><FontAwesomeIcon icon={faArrowUp} className="me-1 text-success" />Ingresos: <span className="balance-value">{formatCurrency(totalBankIncomes)}</span></p>
                <p><FontAwesomeIcon icon={faArrowDown} className="me-1 text-danger" />Gastos: <span className="balance-value">{formatCurrency(totalBankExpenses)}</span></p>
                <p className="fw-bold mt-3">💰 Saldo final: {formatCurrency(finalBank)}</p>
              </div>
            </Col>

            <Col md={6}>
              <div className="balance-box">
                <h4><FontAwesomeIcon icon={faCoins} className="me-2" />Caja</h4>
                <p>Saldo inicial: <span className="balance-value">{formatCurrency(initialCash)}</span></p>
                <p><FontAwesomeIcon icon={faArrowUp} className="me-1 text-success" />Ingresos: <span className="balance-value">{formatCurrency(totalCashIncomes)}</span></p>
                <p><FontAwesomeIcon icon={faArrowDown} className="me-1 text-danger" />Gastos: <span className="balance-value">{formatCurrency(totalCashExpenses)}</span></p>
                <p className="fw-bold mt-3">💵 Saldo final: {formatCurrency(finalCash)}</p>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="text-end balance-timestamp">
              <FontAwesomeIcon icon={faClock} className="me-2" />
              Última actualización: {format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
            </Col>
          </Row>
        </Card>
      </Container>

      <PDFModal show={showPDF} onClose={closePDFModal} title="Vista previa del PDF">
        <BalancePDF balance={balance} />
      </PDFModal>
    </>
  );
};

export default BalanceReport;
