import { Button } from "../components/ui/button";
import CreateHeaderDialog from "../components/dialogs/CreateHeaderDialog";
import { useEffect, useState } from "react";
import { InvoiceMaster } from "../types/invoiceMaster";
import { Customer } from "../types/customer";
import InvoiceHeader from "../components/bill/InvoiceHeader";
import CreateInvoiceItemDialog from "../components/dialogs/CreateInvoiceItemDialog";
import { Product } from "../types/product";
import { InvoiceItem } from "../types/invoiceItem";
import { Profile } from "../types/profile";
import InvoiceItemsTable2 from "../components/tables/InvoiceItemsTable2";

export default function CreateInvoice() {
  const [profile, setProfile] = useState<Profile | null>(null);

useEffect(() => {
  window.api.getProfile().then((data: Profile) => setProfile(data));
}, []);


  const [headerData, setHeaderData] = useState<Partial<InvoiceMaster> | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  // ===== Handle Header Dialog Submit =====
  const handleHeaderSubmit = (
    data: Omit<InvoiceMaster, "id" | "taxableValue" | "billAmount">
  ) => {
    setHeaderData(data);
    console.log("Header Data Saved:", data);
  };

  // ===== Handle Add Item =====
  const handleAddItem = (item: Omit<InvoiceItem, "id" | "invoiceId">) => {
    const newItem: InvoiceItem = {
      ...item,
      id: Date.now(), // temporary unique id for React key
    };
    setInvoiceItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index))
  }


  // ===== Fetch Customers & Products =====
  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await window.api.getCustomers();
      setCustomers(data);
    };

    const fetchProducts = async () => {
      const data = await window.api.getProducts();
      setProducts(data);
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  // ===== Calculate Totals =====
  useEffect(() => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + (item.taxableValue || 0), 0);
    setSubTotal(subtotal);

    const grand = invoiceItems.reduce((acc, item) => acc + (item.total || 0), 0);
    setGrandTotal(grand);
  }, [invoiceItems, headerData]);

  const handleClear = () => {
    setInvoiceItems([]);
    setHeaderData(null);
  }

  // ===== Handle Save Invoice =====
  const handleSaveInvoice = async () => {
    if (!headerData) {
      alert("Please create invoice header before saving.");
      return;
    }

    if (invoiceItems.length === 0) {
      alert("Please add at least one invoice item.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Save Invoice Master first
      const invoiceMasterData = {
        ...headerData,
        taxableValue: subTotal,
        billAmount: grandTotal,
      } as Omit<InvoiceMaster, "id">;

      const { id: invoiceId } = await window.api.addInvoiceMaster(invoiceMasterData);
      console.log("✅ Invoice Master Saved with ID:", invoiceId);
      

      // 2️⃣ Save Invoice Items using that ID
      const itemsToSave = invoiceItems.map((item) => ({
        ...item,
        invoiceId, // ✅ number
      }));

      await window.api.addInvoiceItems({
        invoiceId,
        invoiceItems: itemsToSave,
      });
      console.log("✅ Invoice Items Saved");

      // 3️⃣ Success Message
      alert("Invoice saved successfully!");
      setHeaderData(null);
      setInvoiceItems([]);
      setSubTotal(0);
      setGrandTotal(0);
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      alert("Failed to save invoice due to invalid data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ===== Top Bar ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Invoice</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => history.back()}>
            ← Back
          </Button>

          <CreateHeaderDialog customers={customers} onHeaderSubmit={handleHeaderSubmit} />

          <CreateInvoiceItemDialog products={products} onAddItem={handleAddItem} />
          <Button onClick={handleClear}>Clear</Button>
          <Button
            className="bg-primary text-white"
            onClick={handleSaveInvoice}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* ===== Invoice Header ===== */}
      {headerData ? (
        <InvoiceHeader
          profile={profile}
          customers={customers}
          invoiceMaster={headerData as InvoiceMaster}
        />
      ) : (
        <div className="text-gray-500 italic border rounded-xl p-6 text-center">
          No header created yet.
        </div>
      )}

      {/* ===== Invoice Items Table ===== */}
      <InvoiceItemsTable2
        onDelete={handleDeleteItem}
        products={products}
        invoiceItems={invoiceItems}
        setSubTotal={setSubTotal}
        setGrandTotal={setGrandTotal}
      />
    </div>
  );
}
