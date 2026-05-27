from rest_framework import viewsets

from .models import (
    Company,
    Client,
    Invoice,
    Product
)

from .serializers import (
    CompanySerializer,
    ClientSerializer,
    InvoiceSerializer,
    ProductSerializer
)

from .tasks import process_invoice


class CompanyViewSet(viewsets.ModelViewSet):

    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class ClientViewSet(viewsets.ModelViewSet):

    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class InvoiceViewSet(viewsets.ModelViewSet):

    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def perform_create(self, serializer):
        invoice = serializer.save()
        process_invoice.delay(invoice.id)


class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer