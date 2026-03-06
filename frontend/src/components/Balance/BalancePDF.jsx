import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

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
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    flexDirection: 'column',
    marginLeft: 25,
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
  sectionTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#D5D8DC',
  },
  label: {
    fontSize: 11,
    color: '#566573',
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50'
  }
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

export const BalancePDF = ({ balance }) => {
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
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Image src="/images/logo.png" style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.header}>Informe de Balance</Text>
            <Text style={styles.subHeader}>Asociación Huertos La Salud - Bellavista • Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Banco</Text>
        <View style={styles.row}><Text style={styles.label}>Saldo inicial</Text><Text style={styles.value}>{formatCurrency(initialBank)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Ingresos</Text><Text style={styles.value}>{formatCurrency(totalBankIncomes)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Gastos</Text><Text style={styles.value}>{formatCurrency(totalBankExpenses)}</Text></View>

        <Text style={styles.sectionTitle}>Caja</Text>
        <View style={styles.row}><Text style={styles.label}>Saldo inicial</Text><Text style={styles.value}>{formatCurrency(initialCash)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Ingresos</Text><Text style={styles.value}>{formatCurrency(totalCashIncomes)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Gastos</Text><Text style={styles.value}>{formatCurrency(totalCashExpenses)}</Text></View>

        <Text style={styles.sectionTitle}>Total</Text>
        <View style={styles.row}><Text style={styles.label}>Banco</Text><Text style={styles.value}>{formatCurrency(finalBank)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Caja</Text><Text style={styles.value}>{formatCurrency(finalCash)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Total</Text><Text style={styles.value}>{formatCurrency(finalBank + finalCash)}</Text></View>

        <Text style={[styles.label, { marginTop: 20 }]}>
          Última actualización: {format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
        </Text>
      </Page>
    </Document>
  );
};
