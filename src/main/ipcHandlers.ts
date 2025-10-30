import { app, BrowserWindow, ipcMain } from "electron";
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getCustomers, addCustomer, updateCustomer, deleteCustomer,
  getCandFs, addCandF, updateCandF, deleteCandF,
  getPurchaseMasters, addPurchaseMaster, deletePurchaseMaster, addPurchaseItems,
  getInvoiceMasters, addInvoiceMaster, addInvoiceItems, getInvoiceItems,
  deleteInvoiceMaster,
  getInvoiceMasterById,
  getInvoiceItemsByInvoiceId,
  getProfile,
  saveProfile
} from "./billsRepo";
import fs from "fs";


import { Product } from "@/renderer/types/product";
import { Customer } from "@/renderer/types/customer";
import { CANDF } from "@/renderer/types/cAndF";
import { PurchaseMaster } from "@/renderer/types/purchaseMaster";
import { PurchaseItem } from "@/renderer/types/purchaseItem";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { InvoiceItem } from "@/renderer/types/invoiceItem";
import path from "node:path";

// ============================
// PRODUCTS
// ============================
ipcMain.handle("getProducts", () => getProducts());
ipcMain.handle("addProduct", (_, product: Product) => addProduct(product));
ipcMain.handle("updateProduct", (_, product: Product) => updateProduct(product));
ipcMain.handle("deleteProduct", (_, id: number) => deleteProduct(id));

// ============================
// CUSTOMERS
// ============================
ipcMain.handle("getCustomers", () => getCustomers());
ipcMain.handle("addCustomer", (_, customer: Customer) => addCustomer(customer));
ipcMain.handle("updateCustomer", (_, customer: Customer) => updateCustomer(customer));
ipcMain.handle("deleteCustomer", (_, id: number) => deleteCustomer(id));

// ============================
// C&F SUPPLIERS
// ============================
ipcMain.handle("getCandFs", () => getCandFs());
ipcMain.handle("addCandF", (_, candf: CANDF) => addCandF(candf));
ipcMain.handle("updateCandF", (_, candf: CANDF) => updateCandF(candf));
ipcMain.handle("deleteCandF", (_, id: number) => deleteCandF(id));

// ============================
// PURCHASES
// ============================
ipcMain.handle("get-purchase-masters", () => getPurchaseMasters());
ipcMain.handle("add-purchase-master", async (_, purchaseMaster: PurchaseMaster) => {
  const result = await addPurchaseMaster(purchaseMaster);
  return result;
});
ipcMain.handle("delete-purchase-master", (_, id: number) => deletePurchaseMaster(id));
ipcMain.handle("add-purchase-items", (_, { purchaseId, purchaseItems }: { purchaseId: number; purchaseItems: PurchaseItem[] }) =>
  addPurchaseItems({ purchaseId, purchaseItems })
);

// ============================
// INVOICES
// ============================
ipcMain.handle("get-invoice-masters", () => getInvoiceMasters());
// ADD INVOICE MASTER
ipcMain.handle("add-invoice-master", async (_event, master) => {
  try {
    const id = addInvoiceMaster(master);
    console.log("✅ Invoice Master inserted with ID:", id);
    return { id }; // must return object with id
  } catch (error) {
    console.error("❌ Error adding invoice master:", error);
    throw error;
  }
});



ipcMain.handle("add-invoice-items", (_, { invoiceId, invoiceItems }: { invoiceId: number; invoiceItems: InvoiceItem[] }) =>
  addInvoiceItems(invoiceId, invoiceItems)
);
ipcMain.handle("get-invoice-items", () => getInvoiceItems());


ipcMain.handle("delete-invoice-master", async (_, id: number) => {
  return deleteInvoiceMaster(id);
});

ipcMain.handle("get-invoice-master-by-id", (_, id: number) => {
  return getInvoiceMasterById(Math.floor(id));
});

ipcMain.handle("get-invoice-items-by-invoice-id", (_, invoiceId: number) => {
  return getInvoiceItemsByInvoiceId(Math.floor(invoiceId));
});

ipcMain.handle("print-invoice", async (event, invoiceNumber: string) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) throw new Error("No active window found");

  // Get user's Downloads folder
  const downloadsPath = app.getPath("downloads");

  // Make sure the folder exists
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath, { recursive: true });
  }

  // Target file path: ~/Downloads/xelton_invoices/{invoiceNumber}.pdf
  const targetDir = path.join(downloadsPath, "xelton_invoices");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pdfPath = path.join(targetDir, `${invoiceNumber}.pdf`);

  try {
    // Generate PDF in landscape mode
    const pdfBuffer = await win.webContents.printToPDF({
      landscape: true,
      printBackground: true,
    });

    fs.writeFileSync(pdfPath, pdfBuffer);

    return pdfPath;
  } catch (err) {
    console.error("Failed to save invoice PDF:", err);
    throw err;
  }
});


ipcMain.handle("get-profile", () => getProfile());
ipcMain.handle("save-profile", (_, profile) => saveProfile(profile));


