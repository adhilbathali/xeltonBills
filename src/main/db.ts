import path from "path";
import fs from "fs";
import os from "os";
import Database from "better-sqlite3";
import { app } from "electron";
let dbPath: string;

// In production, Electron provides `app.getPath("userData")` (e.g., C:\Users\<You>\AppData\Roaming\<AppName>)
try {
  dbPath = path.join(app.getPath("userData"), "app.db");
} catch {
  // During dev, Electron's `app` might not be ready, fallback:
  dbPath = path.join(os.homedir(), "app.db");
}

// Ensure the folder exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Create or open the database
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

console.log("📘 SQLite DB Path:", dbPath);


// ============================
// PRODUCTS TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productCD TEXT,
    hsn TEXT,
    uom TEXT CHECK(uom IN ('Box', 'Pack', 'Bottle', 'Strip', 'Piece')),
    mrp REAL,
    ptr REAL,
    pts REAL,
    ptd REAL,
    gst REAL
  )
`).run()

// ============================
// C&F / SUPPLIERS TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS candf (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT,
    companyAddress TEXT,
    email TEXT,
    phone TEXT,
    gstin TEXT,
    pan TEXT
  )
`).run()

// ============================
// CUSTOMERS TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT,
    address TEXT,
    email TEXT,
    phone TEXT,
    gstin TEXT,
    cin TEXT,
    fssai TEXT,
    pan TEXT,
    dlno TEXT,
    dlexp TEXT
  )
`).run()


// ============================
// PURCHASE MASTER TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS purchase_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplierId INTEGER,
    PODate TEXT,
    dueDate TEXT,
    invoiceNumber TEXT,
    igst REAL,
    subTotal REAL,
    grandTotal REAL,
    FOREIGN KEY (supplierId) REFERENCES candf(id) ON DELETE SET NULL
  )
`).run();

// ============================
// PURCHASE ITEMS TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchaseId INTEGER,
    productId INTEGER,
    purchaseRate REAL,
    qty REAL,
    fqty REAL,
    total REAL,
    disc REAL,
    FOREIGN KEY (purchaseId) REFERENCES purchase_master(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
  )
`).run();


// ============================
// INVOICE MASTER TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS invoice_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    invoiceDate TEXT,
    dueDate TEXT,
    invoiceNumber TEXT,
    igst REAL,
    subTotal REAL,
    grandTotal REAL,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
  )
`).run();

// ============================
// INVOICE ITEMS TABLE
// ============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoiceId INTEGER,
    productId INTEGER,
    tradePrice REAL,
    qty REAL,
    exp TEXT,
    fqty REAL,
    total REAL,
    disc REAL,
    FOREIGN KEY (invoiceId) REFERENCES invoice_master(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    companyName TEXT,
    address TEXT,
    email TEXT,
    phone TEXT,
    gstin TEXT,
    cin TEXT,
    fssai TEXT,
    pan TEXT,
    dlno TEXT,
    dlexp TEXT
  )
`).run();


// Check if the profile already exists (to avoid inserting duplicate dummy data)
const existingProfile = db.prepare("SELECT * FROM profile WHERE id = 1").get();

if (!existingProfile) {
  // Insert dummy data if the profile doesn't exist yet
  db.prepare(`
    INSERT INTO profile (id, companyName, address, email, phone, gstin, cin, fssai, pan, dlno, dlexp)
    VALUES
      (1, 'XELTON PHARMA PRIVATE LIMITED', 'Door No.26/356A-1, AARTHUNKAL, Muvattupuzha, Ernakulam, Kerala, 686661', 'xeltonpharmaltd@gmail.com', '+91 94954 08274', '32AAACX5279M1ZW', 'U46497MH2024PTC435400', 'nill', 'AAACX5279M', 'WLF21B2025KL000529', '2030-03-26')
  `).run();
}


export default db;
