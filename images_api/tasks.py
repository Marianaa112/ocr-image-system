from celery import shared_task
from .models import Invoice
import time


@shared_task
def process_invoice(invoice_id):

    start_time = time.time()

    invoice = Invoice.objects.get(id=invoice_id)

    """
    AQUÍ DESPUÉS IRÁ:
    - Tesseract
    - OCR
    - OpenCV
    - PIL
    """

    detected_text = "OCR PENDING"

    invoice.extracted_text = detected_text
    invoice.text_length = len(detected_text)

    end_time = time.time()

    invoice.processing_time = end_time - start_time

    invoice.save()

    return {
        "status": "completed",
        "text_length": invoice.text_length,
        "processing_time": invoice.processing_time
    }