import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFSocios = (socios) => {
  const doc = new jsPDF("landscape", "pt");

  const body = socios.map(socio => [
    socio.numeroSocio,
    socio.numeroHuerto,
    socio.nombre,
    socio.dni,
    socio.telefono,
    socio.email,
    parseDate(socio.fechaDeAlta),
    socio.fechaDeEntrega ? parseDate(socio.fechaDeEntrega) : "",
    socio.tipo.replace("HORTELANO_INVERNADERO", "Invernadero")
              .replace("HORTELANO", "Hortelano")
              .replace("COLABORADOR", "Colaborador")
              .replace("LISTA_ESPERA", "L. Espera")
              .replace("SUBVENCION", "Subvención"),
  ]);

  const columns = [
    { header: "S", dataKey: "numeroSocio" },
    { header: "H", dataKey: "numeroHuerto" },
    { header: "Nombre", dataKey: "nombre" },
    { header: "DNI", dataKey: "dni" },
    { header: "Teléfono", dataKey: "telefono" },
    { header: "Email", dataKey: "email" },
    { header: "Alta", dataKey: "fechaDeAlta" },
    { header: "Entrega", dataKey: "fechaDeEntrega" },
    { header: "Tipo", dataKey: "tipo" },
  ];

  autoTable(doc, {
    columns,
    body,
    margin: { top: 83, bottom: 10, left: 10, right: 10 },
    didDrawPage: () => {
      doc.addImage("/images/logohuerto_pdf.png", "PNG", 10, 10, 111, 63);
      doc.setFontSize(32);
      doc.text("Listado de Socios", 141, 50);
      doc.setFontSize(14);
      doc.text("Asociación Huertos La Salud - Bellavista", 541, 30);
      doc.text("Calle Cronos S/N, Bellavista, Sevilla, 41014", 541, 45);
      doc.text("huertoslasaludbellavista@gmail.com", 541, 60);
    }
  });

  doc.output("dataurlnewwindow");
};

const parseDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};
