import { Customer } from "@/renderer/types/customer";
import { InvoiceMaster } from "@/renderer/types/invoiceMaster";
import { Profile } from "@/renderer/types/profile";
import logo from "../../asset/xelton.png"



type Props = {
  profile: Profile;
  customers: Customer[];
  invoiceMaster: InvoiceMaster;
};

export default function InvoiceHeader({ profile, customers, invoiceMaster }: Props) {
  if (!invoiceMaster) {
    return (
      <div className="text-center text-gray-500 italic">
        Loading invoice details...
      </div>
    );
  }

  const customer = customers.find(c => c.id === invoiceMaster.customerId);

  return (
    <div className="border-b pb-4 print:border-black print:pb-4">
      {/* TAX INVOICE HEADING */}
      <h2 className="text-center text-2xl font-semibold uppercase mb-8">
        Tax Invoice
      </h2>

      <div className="grid grid-cols-12 gap-4 text-sm">

        {/* LEFT - COMPANY DETAILS */}
        <div className="col-span-4">
          {/* COMPANY LOGO AND NAME */}
          <div className="flex items-center gap-4 mb-4">
            {logo && (
              <img
                src={logo}
                alt="Company Logo"
                className="w-28 h-28 object-contain print:w-32 print:h-32"
              />
            )}
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-lg">{profile.companyName}</p>
                <p>{profile.address}</p>
            </div>
          </div>

          {/* COMPANY ADDRESS AND CONTACT */}
          <div className="space-y-2 border-2 p-5">
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <p className="font-black">GSTIN: {profile.gstin}</p>
          </div>
        </div>

        {/* CENTER - INVOICE DETAILS */}
        <div className="col-span-4 border-l border-r px-4">
          <div className="space-y-2">
            {/* INVOICE NUMBER */}
            <div className="flex gap-4">
              <p><strong>Invoice No:</strong></p>
              <p>{invoiceMaster.invoiceNumber}</p>
            </div>

            {/* INVOICE DATE */}
            <div className="flex gap-5">
              <p><strong>Invoice Date:</strong></p>
              <p>{new Date(invoiceMaster.invoiceDate).toLocaleDateString()}</p>
            </div>

            {/* DUE DATE */}
            <div className="flex gap-5">
              <p><strong>Due Date:</strong></p>
              <p>{new Date(invoiceMaster.dueDate).toLocaleDateString()}</p>
            </div>

            <hr  className="w-9/10 h-1 justify-self-center"/>

            {/* Additional Company Details Under Due Date */}
            <div className="space-y-2 mt-4">
              <p><strong>CIN:</strong> {profile.cin}</p>
              <p><strong>FSSAI:</strong> {profile.fssai}</p>
              <p><strong>PAN:</strong> {profile.pan}</p>
              <p><strong>DL No:</strong> {profile.dlno}</p>
              <p><strong>DL Expiry:</strong> {new Date(profile.dlexp).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* RIGHT - CUSTOMER DETAILS */}
        <div className="col-span-4 text-left">
          {customer ? (
            <div className="space-y-4">
              {/* BILL TO LABEL */}
              <p className="font-semibold text-lg">Bill To:</p>

              {/* CUSTOMER INFO */}
              <div>
                <p className="font-semibold">{customer.companyName}</p>
                <p>{customer.address}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                <div className="flex flex-col p-2 border-2 gap-1 mt-1">
                    <p><strong>GSTIN:</strong> {customer.gstin}</p>
                    <p><strong>CIN:</strong>{customer.cin}</p>
                    <p><strong>FSSAI:</strong> {customer.fssai}</p>
                    <p><strong>PAN:</strong> {customer.pan}</p>
                    <p><strong>DL No:</strong> {customer.dlno}</p>
                    <p><strong>DL Expiry:</strong> {new Date(customer.dlexp).toLocaleDateString()}</p>
                                  </div>
                </div>
            </div>
          ) : (
            <p className="italic text-gray-500">Customer details not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
