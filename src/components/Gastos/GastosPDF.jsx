import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CONSTANTS } from '../../util/constants';

Font.register({
  family: 'Open Sans',
  fonts: [{ src: '/fonts/OpenSans.ttf', fontWeight: 'normal' }]
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 12,
    fontFamily: 'Open Sans',
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'left',
  },
  headerText: {
    flexDirection: 'column',
    marginLeft: 25,
  },
  logo: {
    width: 60,
    height: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subHeader: {
    fontSize: 12,
    marginTop: 5,
    color: '#34495E'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3E8F5A',
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    paddingHorizontal: 5,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D5D8DC'
  },
  cell: {
    paddingHorizontal: 5,
    fontSize: 9,
    color: '#2C3E50'
  }
});

const parseDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
};

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? 'Banco' : 'Caja';

export const GastosPDF = ({ gastos }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image src="/images/logo.png" style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.header}>Listado de Gastos</Text>
          <Text style={styles.subHeader}>Asociación Huertos La Salud - Bellavista • Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 2 }]}>Fecha</Text>
        <Text style={[styles.headerCell, { flex: 4 }]}>Concepto</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Importe</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Proveedor</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Factura</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Tipo</Text>
      </View>

      {gastos.map((gasto, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            { backgroundColor: idx % 2 === 0 ? '#ECF0F1' : '#FDFEFE' },
            { borderBottomLeftRadius: idx === gastos.length - 1 ? 10 : 0 },
            { borderBottomRightRadius: idx === gastos.length - 1 ? 10 : 0 },
          ]}
        >
          <Text style={[styles.cell, { flex: 2 }]}>{parseDate(gasto.created_at)}</Text>
          <Text style={[styles.cell, { flex: 4 }]}>{gasto.concept}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{gasto.amount.toFixed(2)} €</Text>
          <Text style={[styles.cell, { flex: 3 }]}>{gasto.supplier}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{gasto.invoice}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{getTypeLabel(gasto.type)}</Text>
        </View>
      ))}
    </Page>
  </Document>
);
