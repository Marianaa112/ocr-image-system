from decimal import Decimal
from io import BytesIO
from unittest.mock import patch

from PIL import Image

from django.core.files.uploadedfile import (
    SimpleUploadedFile
)

from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    Company,
    Client,
    Invoice,
    Product
)


class BaseTestCase(APITestCase):

    def setUp(self):
        self.company = Company.objects.create(
            rfc_emisor='ABC123456789',
            razon_social='Empresa Test',
            regimen_fiscal='601',
            codigo_postal_expedicion='50000',
            certificado_csd='CERT123',
            clave_producto_sat='01010101',
            clave_unidad_sat='H87',
            objeto_impuesto='02',
            iva_default=Decimal('16.00'),
            forma_pago='01',
            metodo_pago='PUE'
        )

        self.client_obj = Client.objects.create(
            rfc='XAXX010101000',
            nombre_razon_social='Cliente Test',
            regimen_fiscal='612',
            codigo_postal_fiscal='50100',
            uso_cfdi='G03',
            correo='cliente@test.com'
        )


class CompanyTests(BaseTestCase):

    def test_create_company(self):
        self.assertEqual(
            self.company.razon_social,
            'Empresa Test'
        )

    def test_get_companies(self):
        response = self.client.get(
            '/api/companies/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )


class ClientTests(BaseTestCase):

    def test_create_client(self):
        self.assertEqual(
            self.client_obj.nombre_razon_social,
            'Cliente Test'
        )

    def test_get_clients(self):
        response = self.client.get(
            '/api/clients/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )


class InvoiceTests(BaseTestCase):

    @patch(
        'images_api.views.process_invoice.delay'
    )
    def test_create_invoice(
        self,
        mock_delay
    ):
        # Crear imagen válida
        image_io = BytesIO()

        image = Image.new(
            'RGB',
            (100, 100),
            'white'
        )

        image.save(
            image_io,
            format='JPEG'
        )

        uploaded_image = SimpleUploadedFile(
            name='ticket.jpg',
            content=image_io.getvalue(),
            content_type='image/jpeg'
        )

        data = {
            'image': uploaded_image,
            'company': self.company.id,
            'client': self.client_obj.id
        }

        response = self.client.post(
            '/api/invoices/',
            data,
            format='multipart'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        invoice = Invoice.objects.first()

        self.assertIsNotNone(invoice)

        mock_delay.assert_called_once_with(
            invoice.id
        )

    def test_get_invoices(self):

        image_io = BytesIO()

        image = Image.new(
            'RGB',
            (100, 100),
            'white'
        )

        image.save(
            image_io,
            format='JPEG'
        )

        uploaded_image = SimpleUploadedFile(
            name='ticket.jpg',
            content=image_io.getvalue(),
            content_type='image/jpeg'
        )

        Invoice.objects.create(
            image=uploaded_image,
            company=self.company,
            client=self.client_obj
        )

        response = self.client.get(
            '/api/invoices/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )


class ProductTests(BaseTestCase):

    def setUp(self):
        super().setUp()

        image_io = BytesIO()

        image = Image.new(
            'RGB',
            (100, 100),
            'white'
        )

        image.save(
            image_io,
            format='JPEG'
        )

        uploaded_image = SimpleUploadedFile(
            name='ticket.jpg',
            content=image_io.getvalue(),
            content_type='image/jpeg'
        )

        self.invoice = Invoice.objects.create(
            image=uploaded_image,
            company=self.company,
            client=self.client_obj
        )

        self.product = Product.objects.create(
            invoice=self.invoice,
            nombre='Producto Test',
            cantidad=2,
            precio=Decimal('150.00')
        )

    def test_create_product(self):
        self.assertEqual(
            self.product.nombre,
            'Producto Test'
        )

        self.assertEqual(
            self.product.cantidad,
            2
        )

        self.assertEqual(
            self.product.precio,
            Decimal('150.00')
        )

    def test_get_products(self):
        response = self.client.get(
            '/api/products/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )