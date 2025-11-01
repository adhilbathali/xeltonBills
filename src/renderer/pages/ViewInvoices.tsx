import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { InvoiceMaster } from "../types/invoiceMaster";
import { Customer } from "../types/customer";
import { Product } from "../types/product";
import { InvoiceItem } from "../types/invoiceItem";
import InvoiceHeader from "../components/bill/InvoiceHeader";
import InvoiceItemsTable from "../components/tables/InvoiceItemsTable";
import { Profile } from "../types/profile";

export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    id: null,
    companyName: "",
    address: "",
    email: "",
    phone: "",
    gstin: "",
    cin: "",
    fssai: "",
    pan: "",
    dlno: "",
    dlexp: new Date()
});

  useEffect(() => {
    window.api.getProfile().then((data: Profile) => setProfile(data));
  }, []);

  const [invoiceMaster, setInvoiceMaster] = useState<InvoiceMaster | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

// 🔹 Fetch invoice and related data
useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const invMaster = await window.api.getInvoiceMasterById(parseInt(id, 10));  // Ensure it’s an integer
      const invItems = await window.api.getInvoiceItemsByInvoiceId(Number(id))  // Ensure it’s an integer
      const custs = await window.api.getCustomers();
      const prods = await window.api.getProducts();

      setInvoiceMaster(invMaster);
      setInvoiceItems(invItems);
      setCustomers(custs);
      setProducts(prods);
    };
    fetchData();
  }, [id]);


  // 🔹 Auto-calc totals
  useEffect(() => {
    if (!invoiceMaster) return;
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
    setSubTotal(subtotal);
    const grand = subtotal;
    setGrandTotal(grand);
  }, [invoiceItems, invoiceMaster]);

  if (!invoiceMaster) {
    return <div className="p-6 text-center text-gray-500 italic">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoice Details</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <Button
  onClick={() => {
    if (invoiceMaster) {
      window.api
        .printInvoice(invoiceMaster.invoiceNumber)
        .then((pdfPath: string) => {
          alert(`✅ PDF saved at:\n${pdfPath}`);
        })
        .catch((err: any) => {
          alert(`❌ Failed to print: ${err.message}`);
        });
    }
  }}
  className="bg-primary text-white"
>
  🖨 Print
</Button>

        </div>
      </div>

      {/* 🔹 Printable Area */}
    <div id="printable-area" className="bg-white p-6">
      <InvoiceHeader
        profile={profile}
        customers={customers}
        invoiceMaster={invoiceMaster}
      />

      <InvoiceItemsTable
        products={products}
        invoiceItems={invoiceItems}
        setSubTotal={setSubTotal}
        setGrandTotal={setGrandTotal}
      />
    </div>
    </div>
  );
}
