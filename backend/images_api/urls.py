from rest_framework.routers import DefaultRouter

from .views import (
    CompanyViewSet,
    ClientViewSet,
    InvoiceViewSet,
    ProductViewSet
)

router = DefaultRouter()

router.register(r'companies', CompanyViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = router.urls