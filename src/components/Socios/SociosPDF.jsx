import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  fonts: [{ src: '/fonts/OpenSans.ttf', fontWeight: 'normal' }]
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 14,
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
    justifyContent: 'left',
    alignItems: 'center',
    marginLeft: 25,
  },
  logo: {
    width: 60,
    height: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 1.5,
  },
  subHeader: {
    fontSize: 14,
    marginTop: 5,
    color: '#34495E'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3E8F5A',
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    paddingHorizontal: 5,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
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

const parseDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

export const SociosPDF = ({ socios }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>

      <View style={styles.headerContainer}>
        <Image src={"/images/logo.png"} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.header}>Listado de socios</Text>
          <Text style={styles.subHeader}>Asociación Huertos La Salud - Bellavista</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 0.2 }]}>S</Text>
        <Text style={[styles.headerCell, { flex: 0.2 }]}>H</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Nombre</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>DNI</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Teléfono</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Email</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Alta</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Tipo</Text>
      </View>

      {socios.map((socio, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            { backgroundColor: idx % 2 === 0 ? '#ECF0F1' : '#FDFEFE' },
            { borderBottomLeftRadius: idx === socios.length - 1 ? 10 : 0 },
            { borderBottomRightRadius: idx === socios.length - 1 ? 10 : 0 },
          ]}
        >
          <Text style={[styles.cell, { flex: 0.2 }]}>{socio.numeroSocio}</Text>
          <Text style={[styles.cell, { flex: 0.2 }]}>{socio.numeroHuerto}</Text>
          <Text style={[styles.cell, { flex: 3 }]}>{socio.nombre}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{socio.dni}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{socio.telefono}</Text>
          <Text style={[styles.cell, { flex: 3 }]}>{socio.email}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{parseDate(socio.fechaDeAlta)}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>
            {socio.tipo
              .replace('HORTELANO_INVERNADERO', 'Invernadero')
              .replace('HORTELANO', 'Hortelano')
              .replace('COLABORADOR', 'Colaborador')
              .replace('LISTA_ESPERA', 'L. Espera')
              .replace('SUBVENCION', 'Subvención')}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);
