export interface CompanyData {
  id?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  gst?: string;
  logo?: string | null;
  signature?: string | null;
  currency?: string;
  // bankDetails: {
  //   accountName: string;
  //   accountNumber: string;
  //   ifsc: string;
  //   bankName: string;
  // };
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  discount: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  status: 'draft' | 'sent' | 'paid';
}
export interface Totals {
  subtotal: string;
  taxAmount: string;
  discount: string;
  total: string;
}

export type InvoiceDetailed = InvoiceData;