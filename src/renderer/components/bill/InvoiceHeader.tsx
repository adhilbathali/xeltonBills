import { Customer } from "@/renderer/types/customer";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { Profile } from "@/renderer/types/profile";
import logo from "../../asset/xelton.png";

type Props = {
  profile: Profile;
  customers: Customer[];
  invoiceMaster: InvoiceMaster;
};

export default function InvoiceHeader({ profile, customers, invoiceMaster }: Props) {
  if (!invoiceMaster) {
    return <div className="text-center text-gray-500 italic">Loading invoice details...</div>;
  }

  const customer = customers.find((c) => c.id === invoiceMaster.customerId);

  return (
    <div className="border-b pb-2 print:border-black print:pb-2 text-[13px] leading-tight">
      {/* TAX INVOICE HEADING */}
      <h2 className="text-center text-xl font-semibold uppercase mb-3 print:mb-2">
        Tax Invoice
      </h2>

      <div className="grid grid-cols-12 gap-3">
        {/* LEFT - COMPANY DETAILS */}
        <div className="col-span-4 space-y-2">
          <div className="flex items-center gap-3">
            {logo && (
              <img
                src={logo}
                alt="Company Logo"
                className="w-16 h-16 object-contain print:w-20 print:h-20"
              />
            )}
            <div>
              <p className="font-bold text-base">{profile.companyName}</p>
              <p className="text-xs">{profile.address}</p>
            </div>
          </div>

          <div className="border p-2 rounded-md space-y-1 text-xs">
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <p className="font-bold">GSTIN: {profile.gstin}</p>
          </div>
        </div>

        {/* CENTER - INVOICE DETAILS */}
        <div className="col-span-4 border-l border-r px-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Invoice No:</span>
            <span>{invoiceMaster.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Invoice Date:</span>
            <span>{new Date(invoiceMaster.invoiceDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Due Date:</span>
            <span>{new Date(invoiceMaster.dueDate).toLocaleDateString()}</span>
          </div>

          <hr className="my-1 border-gray-400" />

          <div className="space-y-0.5">
            <p><strong>CIN:</strong> {profile.cin}</p>
            <p><strong>PAN:</strong> {profile.pan}</p>
            <p><strong>DL No:</strong> {profile.dlno}</p>
            <p><strong>DL Exp:</strong> {new Date(profile.dlexp).toLocaleDateString()}</p>
          </div>
        </div>

        {/* RIGHT - CUSTOMER DETAILS */}
        <div className="col-span-4 text-xs space-y-1">
          {customer ? (
            <>
              <p className="font-semibold text-base mb-1">Bill To:</p>
              <p className="font-semibold">{customer.companyName}</p>
              <p>{customer.address}</p>
              {/* <p>Email: {customer.email}</p> */}
              <p>Phone: {customer.phone}</p>
              <div className="border p-2 mt-1 rounded-md">
                <p><strong>GSTIN:</strong> {customer.gstin}</p>
                <p><strong>DL No:</strong> {customer.dlno}</p>
              </div>
            </>
          ) : (
            <p className="italic text-gray-500">Customer details not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
