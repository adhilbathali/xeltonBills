import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { Customer } from "@/renderer/types/customer";
import { Product } from "@/renderer/types/product";
import { InvoiceItem } from "@/renderer/types/invoiceItem";

type Props = {
  invoiceMasters: InvoiceMaster[];
  customers: Customer[];
  products: Product[];
  invoiceItems: InvoiceItem[];
  onView: (invoiceId: number) => void;
  onDelete: (invoiceId: number) => void;
};

export default function InvoiceMastersTable({
  invoiceMasters,
  customers,
  onView,
  onDelete,
}: Props) {
  if (invoiceMasters.length === 0)
    return (
      <p className="text-gray-500 text-center py-4 italic">
        No invoices yet.
      </p>
    );

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-xl">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="p-2 border border-gray-300 text-left">#</th>
            <th className="p-2 border border-gray-300 text-left">Invoice No</th>
            <th className="p-2 border border-gray-300 text-left">Customer</th>
            <th className="p-2 border border-gray-300 text-center">Invoice Date</th>
            <th className="p-2 border border-gray-300 text-center">Due Date</th>
            <th className="p-2 border border-gray-300 text-right">Sub Total</th>
            <th className="p-2 border border-gray-300 text-center">IGST %</th>
            <th className="p-2 border border-gray-300 text-right">Grand Total</th>
            <th className="p-2 border border-gray-300 text-center">Manage</th>
          </tr>
        </thead>

        <tbody>
          {invoiceMasters.map((inv, index) => {
            const customer = customers.find((c) => c.id === inv.customerId);
            const invoiceDate = new Date(inv.invoiceDate).toLocaleDateString("en-IN");

            return (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{index + 1}</td>
                <td className="p-2 border border-gray-300">{inv.invoiceNumber}</td>
                <td className="p-2 border border-gray-300">{customer?.companyName ?? "—"}</td>
                <td className="p-2 border border-gray-300 text-center">{invoiceDate}</td>
                <td className="p-2 border border-gray-300 text-center">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="p-2 border border-gray-300 text-right">{inv.subTotal.toFixed(2)}</td>
                <td className="p-2 border border-gray-300 text-center">{inv.igst}%</td>
                <td className="p-2 border border-gray-300 text-right font-semibold">
                  {inv.grandTotal.toFixed(2)}
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(inv.id)}
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(inv.id)}
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
