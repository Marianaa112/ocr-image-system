export const SAT_USO_CFDI = [
  { c: "G01", d: "Adquisición de mercancías" },
  { c: "G03", d: "Gastos en general" },
  { c: "I04", d: "Equipo de cómputo y accesorios" },
  { c: "I08", d: "Otra maquinaria y equipo" },
  { c: "D01", d: "Honorarios médicos y dentales" },
  { c: "P01", d: "Por definir" },
  { c: "S01", d: "Sin efectos fiscales" },
];

export const SAT_REGIMEN = [
  { c: "601", d: "General de Ley Personas Morales" },
  { c: "603", d: "Personas Morales con Fines no Lucrativos" },
  { c: "605", d: "Sueldos y Salarios e Ingresos Asimilados" },
  { c: "612", d: "Personas Físicas con Actividades Empresariales y Profesionales" },
  { c: "621", d: "Incorporación Fiscal" },
  { c: "626", d: "Régimen Simplificado de Confianza (RESICO)" },
];

export const SAT_FORMA_PAGO = [
  { c: "01", d: "Efectivo" },
  { c: "02", d: "Cheque nominativo" },
  { c: "03", d: "Transferencia electrónica" },
  { c: "04", d: "Tarjeta de crédito" },
  { c: "28", d: "Tarjeta de débito" },
  { c: "99", d: "Por definir" },
];

export const SAT_METODO_PAGO = [
  { c: "PUE", d: "Pago en una sola exhibición" },
  { c: "PPD", d: "Pago en parcialidades o diferido" },
];

export const SAT_OBJ_IMP = [
  { c: "01", d: "No objeto de impuesto" },
  { c: "02", d: "Sí objeto de impuesto" },
  { c: "03", d: "Sí objeto, no obligado al desglose" },
];

export const EMISOR = {
  rfc: "QTS200815AB7",
  razon: "QUOTIS COMERCIAL S.A. DE C.V.",
  regimen: "601",
  cp: "06600",
  csdNum: "00001000000512345678",
  csdVence: "2027-04-18",
  claveProd: "01010101",
  claveUnidad: "ACT",
  objImp: "02",
  ivaDefault: 16,
  formasPago: ["01", "03", "04", "28"],
  metodoPago: "PUE",
};

export const fmt = (n) => "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtRaw = (n) => Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function mapFormaPago(text) {
  if (!text) return "99";
  const t = text.toUpperCase();
  if (t.includes("EFECTIVO")) return "01";
  if (t.includes("CHEQUE")) return "02";
  if (t.includes("TRANSFERENCIA")) return "03";
  if (t.includes("CREDITO") || t.includes("CRÉDITO")) return "04";
  if (t.includes("DEBITO") || t.includes("DÉBITO")) return "28";
  return "99";
}