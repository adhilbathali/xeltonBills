import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import InvoiceMastersTable from "../components/tables/InvoiceMastersTable";
import { InvoiceMaster } from "../types/invoiceMaster";
import { Customer } from "../types/customer";
import { Product } from "../types/product";
import { InvoiceItem } from "../types/invoiceItem";

export default function Invoices() {
  const navigate = useNavigate();
  const [invoiceMasters, setInvoiceMasters] = useState<InvoiceMaster[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const invs = await window.api.getInvoiceMasters();
      const custs = await window.api.getCustomers();
      const prods = await window.api.getProducts();
      const items = await window.api.getInvoiceItems();

      setInvoiceMasters(invs);
      setCustomers(custs);
      setProducts(prods);
      setInvoiceItems(items);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    await window.api.deleteInvoiceMaster(id);
    setInvoiceMasters((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleView = (id: number) => {
    navigate(`/view-invoice/${id}`);
  };

  // ====== Derived Quick Stats ======
  const totalInvoices = invoiceMasters.length;
  const totalSales = invoiceMasters.reduce(
    (sum, inv) => sum + (inv.billAmount || 0),
    0
  );
  const totalItemsSold = invoiceItems.reduce(
    (sum, item) => sum + (item.qty || 0),
    0
  );
  const avgInvoiceValue =
    totalInvoices > 0 ? totalSales / totalInvoices : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-4xl text-slate-800 font-semibold">Invoices</h1>
        <Button onClick={() => navigate("/create-invoice")}>
          + Create Invoice
        </Button>
      </div>

      {/* === Quick Stats Section === */}
{/* === Quick Stats Section === */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>Total Invoices</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-slate-700">
      {totalInvoices.toLocaleString("en-IN")}
    </CardContent>
  </Card>

  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>Total Sales</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-green-600">
      ₹{totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
    </CardContent>
  </Card>

  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>Items Sold</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-blue-600">
      {totalItemsSold.toLocaleString("en-IN")}
    </CardContent>
  </Card>

  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>Average Invoice Amount</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold text-slate-600">
      ₹{avgInvoiceValue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </CardContent>
  </Card>
</div>


      {/* === Invoice Table === */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceMastersTable
            invoiceMasters={invoiceMasters}
            customers={customers}
            products={products}
            invoiceItems={invoiceItems}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
