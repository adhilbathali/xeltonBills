import { contextBridge, ipcRenderer } from "electron";
import { Product } from "@/renderer/types/product";
import { Customer } from "@/renderer/types/customer";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { InvoiceItem } from "@/renderer/types/invoiceItem";
import { Profile } from "@/renderer/types/profile";

contextBridge.exposeInMainWorld("api", {
  // ============================
  // PRODUCTS
  // ============================
  getProducts: () => ipcRenderer.invoke("getProducts"),
  addProduct: (product: Product) => ipcRenderer.invoke("addProduct", product),
  updateProduct: (product: Product) => ipcRenderer.invoke("updateProduct", product),
  deleteProduct: (id: number) => ipcRenderer.invoke("deleteProduct", id),

  // ============================
  // CUSTOMERS
  // ============================
  getCustomers: () => ipcRenderer.invoke("getCustomers"),
  addCustomer: (customer: Customer) => ipcRenderer.invoke("addCustomer", customer),
  updateCustomer: (customer: Customer) => ipcRenderer.invoke("updateCustomer", customer),
  deleteCustomer: (id: number) => ipcRenderer.invoke("deleteCustomer", id),

  // ============================
  // INVOICES
  // ============================
  getInvoiceMasters: () => ipcRenderer.invoke("get-invoice-masters"),
  addInvoiceMaster: (invoiceMaster: InvoiceMaster) =>
    ipcRenderer.invoke("add-invoice-master", invoiceMaster),
  addInvoiceItems: ({ invoiceId, invoiceItems }: { invoiceId: number; invoiceItems: InvoiceItem[] }) =>
    ipcRenderer.invoke("add-invoice-items", { invoiceId, invoiceItems }),
  getInvoiceItems: () => ipcRenderer.invoke("get-invoice-items"),

  deleteInvoiceMaster: (id: number) => ipcRenderer.invoke("delete-invoice-master", id),

  getInvoiceMasterById: (id: number) => ipcRenderer.invoke("get-invoice-master-by-id", Math.floor(id)),
  getInvoiceItemsByInvoiceId: (invoiceId: number) => ipcRenderer.invoke("get-invoice-items-by-invoice-id", Math.floor(invoiceId)),
  printInvoice: (invoiceNumber: string) =>
    ipcRenderer.invoke("print-invoice", invoiceNumber),
  getProfile: () => ipcRenderer.invoke("get-profile"),
  saveProfile: (profile: Profile) => ipcRenderer.invoke("save-profile", profile),
});
