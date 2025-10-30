import { useEffect, useState } from "react";
import { ReceiptText, UserStarIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import AddCustomerDialog from "../components/dialogs/AddCustomerDialog";
import CustomerCard from "../components/cards/CustomerCard";
import { Customer } from "../types/customer";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleAddCustomer = (newCustomer: Customer) => {
    window.api.addCustomer(newCustomer);
    setCustomers([...customers, newCustomer]);
  };

  const handleDeleteCustomer = (id: Customer["id"]) => {
    window.api.deleteCustomer(id);
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    window.api.updateCustomer(updatedCustomer);
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = (await window.api.getCustomers()) as Customer[];
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const totalCustomers = customers.length;

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6">
      {/* ===== Header Section ===== */}
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-tight">
          Customers
        </h1>
        <AddCustomerDialog onAdd={handleAddCustomer} />
      </header>

      {/* ===== Stats Section ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-50 border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-lg">
              <UserStarIcon className="w-5 h-5 text-blue-500" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-800">
              {totalCustomers}
            </p>
          </CardContent>
        </Card>

        {/* <Card className="bg-slate-50 border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-lg">
              <ReceiptText className="w-5 h-5 text-green-500" />
              Avg Invoices / Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-800">
              {totalCustomers > 0 ? (30 / totalCustomers).toFixed(1) : 0}
            </p>
          </CardContent>
        </Card> */}
      </section>

      {/* ===== Customer Cards Section ===== */}
      <main className="flex-1 mt-4">
        {customers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-60 text-slate-500">
            <p className="text-lg">No customers found.</p>
            <Button className="mt-3" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                onEdit={handleUpdateCustomer}
                onDelete={handleDeleteCustomer}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
