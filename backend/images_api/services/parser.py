import re
from datetime import date


def _find(pattern, text, group=1, flags=re.IGNORECASE):
    match = re.search(pattern, text, flags)
    return match.group(group).strip() if match else None


def parse(text: str) -> dict:
    result = {
        "total": None,
        "iva": None,
        "fecha": None,
        "forma_pago_detectada": None,
    }

    # Total (evita match con SUBTOTAL)
    raw_total = _find(r"(?<!SUB)TOTAL[:\s]+\$?([\d,]+\.?\d*)", text)
    if raw_total:
        result["total"] = float(raw_total.replace(",", "."))

    # IVA
    raw_iva = _find(r"IVA[^:]*[:\s]+\$?([\d,]+\.?\d*)", text)
    if raw_iva:
        result["iva"] = float(raw_iva.replace(",", "."))

    # Fecha (DD/MM/YYYY o YYYY-MM-DD)
    raw_fecha = _find(r"FECHA[:\s]+(\d{2}/\d{2}/\d{4})", text)
    if raw_fecha:
        d, m, y = raw_fecha.split("/")
        result["fecha"] = date(int(y), int(m), int(d)).isoformat()
    else:
        raw_fecha = _find(r"FECHA[:\s]+(\d{4}-\d{2}-\d{2})", text)
        if raw_fecha:
            result["fecha"] = raw_fecha

    # Forma de pago
    raw_pago = _find(r"FORMA\s+PAGO[:\s]+(\w+)", text)
    if raw_pago:
        result["forma_pago_detectada"] = raw_pago.upper()

    return result
