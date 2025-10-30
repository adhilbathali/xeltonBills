import { Product } from "@/renderer/types/product";
import { Customer } from "@/renderer/types/customer";
import { CANDF } from "@/renderer/types/cAndF";
import db from "./db";
import { PurchaseMaster } from "@/renderer/types/purchaseMaster";
import { PurchaseItem } from "@/renderer/types/purchaseItem";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { InvoiceItem } from "@/renderer/types/invoiceItem";
import { Profile } from "@/renderer/types/profile";

// ============================
// PRODUCTS
// ============================
export function getProducts(): Product[] {
  const rows = db.prepare("SELECT * FROM products ORDER BY id DESC").all() as Product[];
  return rows;
}

export function addProduct(product: Product) {
  const { productCD, hsn, uom, mrp, ptr, pts, ptd, gst } = product;

  const stmt = db.prepare(`
    INSERT INTO products (productCD, hsn, uom, mrp, ptr, pts, ptd, gst)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(productCD, hsn, uom, mrp, ptr, pts, ptd, gst);

  return product;
}

export function updateProduct(product: Product) {
  const { id, productCD, hsn, uom, mrp, ptr, pts, ptd, gst } = product;

  if (!id) throw new Error("Product ID is required for update.");

  const stmt = db.prepare(`
    UPDATE products SET
      productCD = ?,
      hsn = ?,
      uom = ?,
      mrp = ?,
      ptr = ?,
      pts = ?,
      ptd = ?,
      gst = ?
    WHERE id = ?
  `);

  stmt.run(productCD, hsn, uom, mrp, ptr, pts, ptd, gst, id);

  return product;
}

export function deleteProduct(id: number) {
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  stmt.run(id);
  return id;
}

// ============================
// CUSTOMERS
// ============================
export function getCustomers(): Customer[] {
  const rows = db.prepare("SELECT * FROM customers ORDER BY id DESC").all() as any[];

  return rows.map((row) => ({
    ...row,
    dlexp: row.dlexp ? new Date(row.dlexp) : null,
  }));
}

export function addCustomer(customer: Customer) {
  const { companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexp } = customer;

  const dlexpString =
    dlexp instanceof Date ? dlexp.toISOString().split("T")[0] : dlexp || null;

  db.prepare(`
    INSERT INTO customers (companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexpString);

  return customer;
}

export function updateCustomer(customer: Customer) {
  const { id, companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexp } = customer;

  if (!id) throw new Error("Customer ID is required for update.");

  const dlexpString =
    dlexp instanceof Date ? dlexp.toISOString().split("T")[0] : dlexp || null;

  const stmt = db.prepare(`
    UPDATE customers
    SET companyName = ?,
        address = ?,
        email = ?,
        phone = ?,
        gstin = ?,
        cin = ?,
        fssai = ?,
        pan = ?,
        dlno = ?,
        dlexp = ?
    WHERE id = ?
  `);

  stmt.run(companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexpString, id);

  return customer;
}

export function deleteCustomer(id: number) {
  const stmt = db.prepare("DELETE FROM customers WHERE id = ?");
  stmt.run(id);
  return id;
}

// ============================
// C&F / SUPPLIERS
// ============================
export function getCandFs(): CANDF[] {
  return db.prepare("SELECT * FROM candf ORDER BY id DESC").all() as CANDF[];
}

export function addCandF(candf: CANDF) {
  const { companyName, companyAddress, email, phone, gstin, pan } = candf;

  db.prepare(`
    INSERT INTO candf (companyName, companyAddress, email, phone, gstin, pan)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(companyName, companyAddress, email, phone, gstin, pan);

  return candf;
}

export function updateCandF(candf: CANDF) {
  const { id, companyName, companyAddress, email, phone, gstin, pan } = candf;

  if (!id) throw new Error("C&F ID is required for update.");

  const stmt = db.prepare(`
    UPDATE candf
    SET
      companyName = ?,
      companyAddress = ?,
      email = ?,
      phone = ?,
      gstin = ?,
      pan = ?
    WHERE id = ?
  `);

  stmt.run(companyName, companyAddress, email, phone, gstin, pan, id);

  return candf;
}

export function deleteCandF(id: number) {
  if (!id) throw new Error("C&F ID is required for deletion.");
  const stmt = db.prepare("DELETE FROM candf WHERE id = ?");
  stmt.run(id);
  return { success: true };
}

export function getPurchaseMasters(): PurchaseMaster[] {
  return db.prepare("SELECT * FROM purchase_master ORDER BY id DESC").all() as PurchaseMaster[];
}

export function addPurchaseMaster(purchaseMaster: PurchaseMaster) {
  const stmt = db.prepare(`
    INSERT INTO purchase_master (supplierId, PODate, dueDate, invoiceNumber, igst, subTotal, grandTotal)
    VALUES (@supplierId, @PODate, @dueDate, @invoiceNumber, @igst, @subTotal, @grandTotal)
  `)

  const PODate = purchaseMaster.PODate instanceof Date
    ? purchaseMaster.PODate.toISOString().split("T")[0]
    : purchaseMaster.PODate;

  const dueDate = purchaseMaster.dueDate instanceof Date
    ? purchaseMaster.dueDate.toISOString().split("T")[0]
    : purchaseMaster.dueDate;


  const result = stmt.run({
    supplierId: purchaseMaster.supplierId,
    PODate: PODate,
    dueDate: dueDate,
    invoiceNumber: purchaseMaster.invoiceNumber,
    igst: purchaseMaster.igst,
    subTotal: purchaseMaster.subTotal,
    grandTotal: purchaseMaster.grandTotal,
  })
  return { id: result.lastInsertRowid };

}

export function deletePurchaseMaster(id: number) {
  try {
    const stmt = db.prepare(`DELETE FROM purchase_master WHERE id = ?`)
    const result = stmt.run(id)

    if (result.changes === 0) {
      return { success: false, message: "No purchase found with given ID" }
    }

    return { success: true, message: "Purchase deleted successfully" }
  } catch (error) {
    console.error("Error deleting purchase:", error)
    return { success: false, message: "Error deleting purchase" }
  }
}

export function addPurchaseItems({ purchaseId, purchaseItems }: { purchaseId: number, purchaseItems: PurchaseItem[] }) {
  const stmt = db.prepare(`
    INSERT INTO purchase_items (purchaseId, productId, purchaseRate, qty, fqty, total, disc)
    VALUES (@purchaseId, @productId, @purchaseRate, @qty, @fqty, @total, @disc)
  `)

  const insertMany = db.transaction((purchaseItems: PurchaseItem[]) => {
    for (const item of purchaseItems) {
      stmt.run({
        purchaseId,
        productId: item.productId,
        purchaseRate: item.purchaseRate,
        qty: item.qty,
        fqty: item.fqty,
        total: item.total,
        disc: item.disc,
      })
    }
  })

  insertMany(purchaseItems)
  return { success: true }
}

export function addInvoiceMaster(master: Omit<InvoiceMaster, "id">): number {
  const stmt = db.prepare(`
    INSERT INTO invoice_master (
      customerId,
      invoiceDate,
      dueDate,
      invoiceNumber,
      igst,
      subTotal,
      grandTotal
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    master.customerId,
    master.invoiceDate instanceof Date ? master.invoiceDate.toISOString().split("T")[0] : master.invoiceDate,
    master.dueDate instanceof Date ? master.dueDate.toISOString().split("T")[0] : master.dueDate,
    master.invoiceNumber,
    master.igst,
    master.subTotal,
    master.grandTotal
  );

  // ✅ Always return an integer
  return parseInt(info.lastInsertRowid.toString(), 10);
}




// ============================
// GET ALL INVOICE MASTERS
// ============================
export function getInvoiceMasters(): InvoiceMaster[] {
  const rows = db.prepare("SELECT * FROM invoice_master ORDER BY id DESC").all();
  return rows.map((row: any) => ({
    ...row,
    invoiceDate: new Date(row.invoiceDate),
    dueDate: new Date(row.dueDate),
  })) as InvoiceMaster[];
}

// ============================
// ADD INVOICE ITEMS
// ============================
export function addInvoiceItems(
  invoiceId: number,
  items: Omit<InvoiceItem, "id" | "invoiceId">[]
) {
  const stmt = db.prepare(`
    INSERT INTO invoice_items (
      invoiceId,
      productId,
      tradePrice,
      qty,
      exp,
      fqty,
      total,
      disc
    ) VALUES (
      @invoiceId,
      @productId,
      @tradePrice,
      @qty,
      @exp,
      @fqty,
      @total,
      @disc
    )
  `);

  const insertMany = db.transaction((invoiceId: number, items: any[]) => {
    for (const item of items) {
      stmt.run({
        ...item,
        invoiceId,
        exp: item.exp.toISOString(),
      });
    }
  });

  insertMany(invoiceId, items);
}

// ============================
// GET ALL INVOICE ITEMS
// ============================
export function getInvoiceItems(): InvoiceItem[] {
  const rows = db
    .prepare("SELECT * FROM invoice_items ORDER BY id DESC").all()

  return rows.map((row: any) => ({
    ...row,
    exp: new Date(row.exp),
  })) as InvoiceItem[];
}

// ============================
// DELETE INVOICE MASTER (and cascade items)
// ============================
export function deleteInvoiceMaster(id: number): { success: boolean; message?: string } {
  try {
    const stmt = db.prepare("DELETE FROM invoice_master WHERE id = ?");
    const info = stmt.run(id);

    if (info.changes === 0) {
      return { success: false, message: "Invoice not found" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, message: error.message };
  }
}

// ============================
// GET INVOICE MASTER BY ID
// ============================
export function getInvoiceMasterById(id: number) {
  const invoiceMaster = db.prepare("SELECT * FROM invoice_master WHERE id = ?").get(Math.floor(id)); // Ensure it's an integer

  if (!invoiceMaster) {
    console.error(`Invoice Master with ID ${id} not found.`);
    return null; // Or throw an error if preferred
  }

  return invoiceMaster;
}

// ============================
// GET INVOICE ITEMS BY INVOICE ID
// ============================
export function getInvoiceItemsByInvoiceId(invoiceId: number) {
  const rows = db
    .prepare("SELECT * FROM invoice_items WHERE invoiceId = ?")
    .all(Math.floor(invoiceId));

  return rows.map((row: any) => ({
    ...row,
    exp: new Date(row.exp),
  })) as InvoiceItem[];
}


export function getProfile(): Profile | null {
  const result = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Profile;

  if (result) {
    // Convert dlexp back to a Date object if it exists
    result.dlexp = result.dlexp ? new Date(result.dlexp) : null;
    return result as Profile;
  }

  return null;
}


// Update the saveProfile function to handle the date field
export function saveProfile(profile: Profile) {
  const { dlexp, ...restOfProfile } = profile;

  // Convert date to ISO string before saving
  const profileWithDateAsString = {
    ...restOfProfile,
    dlexp: dlexp ? dlexp.toISOString() : null, // Convert date to ISO string, or null if not available
  };

  db.prepare(`
    INSERT INTO profile (id, companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexp)
    VALUES (1, @companyName, @address, @email, @phone, @gstin, @cin, @fssai, @pan, @dlno, @dlexp)
    ON CONFLICT(id) DO UPDATE SET
      companyName=@companyName,
      address=@address,
      email=@email,
      phone=@phone,
      gstin=@gstin,
      cin=@cin,
      fssai=@fssai,
      pan=@pan,
      dlno=@dlno,
      dlexp=@dlexp
  `).run(profileWithDateAsString);
}


