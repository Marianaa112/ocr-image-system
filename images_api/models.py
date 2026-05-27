from django.db import models


class Company(models.Model):

    rfc_emisor = models.CharField(max_length=50)

    razon_social = models.CharField(max_length=255)

    regimen_fiscal = models.CharField(max_length=100)

    codigo_postal_expedicion = models.CharField(max_length=10)

    certificado_csd = models.CharField(max_length=255)

    clave_producto_sat = models.CharField(max_length=50)

    clave_unidad_sat = models.CharField(max_length=50)

    objeto_impuesto = models.CharField(max_length=100)

    iva_default = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    forma_pago = models.CharField(max_length=100)

    metodo_pago = models.CharField(max_length=100)

    def __str__(self):
        return self.razon_social


class Client(models.Model):

    rfc = models.CharField(max_length=50)

    nombre_razon_social = models.CharField(
        max_length=255
    )

    regimen_fiscal = models.CharField(
        max_length=100
    )

    codigo_postal_fiscal = models.CharField(
        max_length=10
    )

    uso_cfdi = models.CharField(
        max_length=100
    )

    correo = models.EmailField()

    def __str__(self):
        return self.nombre_razon_social


class Invoice(models.Model):

    image = models.ImageField(
        upload_to='tickets/'
    )

    extracted_text = models.TextField(
        blank=True,
        null=True
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    iva = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    fecha = models.DateField(
        null=True,
        blank=True
    )

    forma_pago_detectada = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    text_length = models.IntegerField(
        default=0
    )

    processing_time = models.FloatField(
        default=0
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Invoice {self.id}"


class Product(models.Model):

    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='products'
    )

    nombre = models.CharField(
        max_length=255
    )

    cantidad = models.IntegerField(
        default=1
    )

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return self.nombre