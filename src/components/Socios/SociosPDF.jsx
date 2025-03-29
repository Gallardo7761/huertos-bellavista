// src/components/pdf/SociosPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fuente Open Sans
Font.register({
  family: 'Open Sans',
  fonts: [{ src: '/fonts/OpenSans.ttf', fontWeight: 'normal' }]
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Open Sans',
    backgroundColor: '#F0F4F8', // Fondo suave y moderno
  },
  header: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2C3E50', // Azul oscuro elegante
    letterSpacing: 1.5,
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495E'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2980B9', // Azul vibrante para destacar
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
    fontSize: 11,
    color: '#2C3E50'
  },
});

const parseDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const SociosPDF = ({ socios }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.header}>Listado de Socios</Text>
      <Text style={styles.subHeader}>Asociación Huertos La Salud - Bellavista</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 0.5 }]}>Socio Nº</Text>
        <Text style={[styles.headerCell, { flex: 0.5 }]}>Huerto Nº</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Nombre</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>DNI</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Teléfono</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Email</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Alta</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Entrega</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Tipo</Text>
      </View>

      {socios.map((socio, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            { backgroundColor: idx % 2 === 0 ? '#ECF0F1' : '#FDFEFE' }
          ]}
        >
          <Text style={[styles.cell, { flex: 0.5 }]}>{socio.numeroSocio}</Text>
          <Text style={[styles.cell, { flex: 0.5 }]}>{socio.numeroHuerto}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{socio.nombre}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{socio.dni}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{socio.telefono}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{socio.email}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{parseDate(socio.fechaDeAlta)}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>
            {socio.fechaDeEntrega ? parseDate(socio.fechaDeEntrega) : ''}
          </Text>
          <Text style={[styles.cell, { flex: 1.5 }]}>
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

export default SociosPDF;
