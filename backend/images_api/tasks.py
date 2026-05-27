from celery import shared_task
from .models import Invoice
from .services.preprocessing import preprocess
from .services.ocr import extract_text
from .services.parser import parse
import time


@shared_task
def process_invoice(invoice_id):

    start_time = time.time()

    invoice = Invoice.objects.get(id=invoice_id)

    binary_image = preprocess(invoice.image.path)
    detected_text = extract_text(binary_image)
    parsed = parse(detected_text)

    invoice.extracted_text = detected_text
    invoice.text_length = len(detected_text)
    invoice.total = parsed["total"]
    invoice.iva = parsed["iva"]
    invoice.fecha = parsed["fecha"]
    invoice.forma_pago_detectada = parsed["forma_pago_detectada"]
    invoice.processing_time = time.time() - start_time
    invoice.save()

    return {
        "status": "completed",
        "text_length": invoice.text_length,
        "processing_time": invoice.processing_time
    }
