const API_BASE = "http://localhost:8000/api";

const api = {
  async createInvoice(imageFile, companyId = 1, clientId = 1) {
    const form = new FormData();
    form.append("image", imageFile);
    form.append("company", companyId);
    form.append("client", clientId);
    const res = await fetch(`${API_BASE}/invoices/`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Error al crear invoice");
    return res.json();
  },

  async getInvoice(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}/`);
    if (!res.ok) throw new Error("Error al obtener invoice");
    return res.json();
  },

  async listInvoices() {
    const res = await fetch(`${API_BASE}/invoices/`);
    if (!res.ok) throw new Error("Error al listar invoices");
    return res.json();
  },

  async pollInvoice(id, maxAttempts = 20, intervalMs = 1500) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, intervalMs));
      const invoice = await this.getInvoice(id);
      if (invoice.text_length > 0) return invoice;
    }
    throw new Error("OCR timeout: el procesamiento tardó demasiado");
  },
};
