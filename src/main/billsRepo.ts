import { Product } from "@/renderer/types/product";
import { Customer } from "@/renderer/types/customer";
import db from "./db";
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
    INSERT INTO products (productCD, hsn, uom, mrp,
     ptr, pts, ptd, gst)
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

export function addInvoiceMaster(master: Omit<InvoiceMaster, "id">): number {
  const stmt = db.prepare(`
    INSERT INTO invoice_master (
      customerId,
      invoiceDate,
      dueDate,
      invoiceNumber,
      taxableValue,
      billAmount
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    master.customerId,
    master.invoiceDate instanceof Date ? master.invoiceDate.toISOString().split("T")[0] : master.invoiceDate,
    master.dueDate instanceof Date ? master.dueDate.toISOString().split("T")[0] : master.dueDate,
    master.invoiceNumber,
    master.taxableValue,
    master.billAmount
  );

  // ✅ Always return an integer
  return parseInt(info.lastInsertRowid.toString(), 10);
}




// ============================
// GET ALL INVOICE MASTERS
// ============================
export function getInvoiceMasters(): InvoiceMaster[] {
  const rows = db.prepare("SELECT * FROM invoice_master ORDER BY id DESC").all();
  console.log(rows)
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
      batchNo,
      tradePrice,
      qty,
      mfg,
      exp,
      fqty,
      total,
      disc
    ) VALUES (
      @invoiceId,
      @productId,
      @batchNo,
      @tradePrice,
      @qty,
      @mfg,
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
        mfg: item.mfg.toISOString(),
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
    mfg: new Date(row.mfg),
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
    mfg: new Date(row.mfg),
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


