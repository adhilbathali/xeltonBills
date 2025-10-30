import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import GenericSelect from "../GenericSelect";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { Customer } from "@/renderer/types/customer";

type Props = {
  customers: Customer[];
  onHeaderSubmit: (headerData: Omit<InvoiceMaster, "id" | "subTotal" | "grandTotal">) => void;
};

export default function CreateHeaderDialog({ customers, onHeaderSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // ✅ Helper to get today's date in YYYY-MM-DD format
  const getToday = () => new Date().toISOString().split("T")[0];

  // ✅ Initialize invoiceDate and dueDate with current date
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(getToday());
  const [dueDate, setDueDate] = useState(getToday());
  const [igst, setIgst] = useState(0);

  const handleSubmit = () => {
    if (!customer) return alert("Please select a customer");
    if (!invoiceNumber || !invoiceDate || !dueDate)
      return alert("Please fill all fields");

    const data = {
      customerId: customer.id,
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      igst,
    };

    onHeaderSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">+ Create Header</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Create Invoice Header</DialogTitle>
          <DialogDescription>
            Fill out the invoice details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Customer</label>
          <GenericSelect
            selectType="customers"
            options={customers}
            onSelect={(option) => setCustomer(option as Customer)}
          />

          <label className="block text-sm font-medium">Invoice Number</label>
          <Input
            placeholder="Enter invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Invoice Date</label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <label className="block text-sm font-medium">IGST (%)</label>
          <Input
            type="number"
            placeholder="Enter IGST"
            value={igst}
            onChange={(e) => setIgst(Number(e.target.value))}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit}>Save Header</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
