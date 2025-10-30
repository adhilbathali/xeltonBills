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

  // helper to check if a value is valid (not nill / empty)
  const isValid = (value?: string | number | Date) => {
    if (!value) return false;
    if (typeof value === "string") {
      const lower = value.toLowerCase().trim();
      return (
        lower !== "nill" &&
        lower !== "nil" &&
        lower !== "null" &&
        lower !== "n/a" &&
        lower !== "nill@nill" &&
        lower !== ""
      );
    }
    return true;
  };

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
              {isValid(profile.address) && <p className="text-xs">{profile.address}</p>}
            </div>
          </div>

          <div className="border p-2 rounded-md space-y-1 text-xs">
            {isValid(profile.email) && <p>Email: {profile.email}</p>}
            {isValid(profile.phone) && <p>Phone: {profile.phone}</p>}
            {isValid(profile.gstin) && <p className="font-bold">GSTIN: {profile.gstin}</p>}
            {isValid(profile.fssai) && <p>FSSAI: {profile.fssai}</p>}
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
            {isValid(profile.cin) && (
              <p>
                <strong>CIN:</strong> {profile.cin}
              </p>
            )}
            {isValid(profile.pan) && (
              <p>
                <strong>PAN:</strong> {profile.pan}
              </p>
            )}
            {isValid(profile.dlno) && (
              <p>
                <strong>DL No:</strong> {profile.dlno}
              </p>
            )}
            {isValid(profile.dlexp) && (
              <p>
                <strong>DL Exp:</strong>{" "}
                {new Date(profile.dlexp).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT - CUSTOMER DETAILS */}
        <div className="col-span-4 text-xs space-y-1">
          {customer ? (
            <>
              <p className="font-semibold text-base mb-1">Bill To:</p>
              <p className="font-semibold">{customer.companyName}</p>
              {isValid(customer.address) && <p>{customer.address}</p>}
              {isValid(customer.phone) && <p>Phone: {customer.phone}</p>}

              <div className="border p-2 mt-1 rounded-md space-y-0.5">
                {isValid(customer.gstin) && (
                  <p>
                    <strong>GSTIN:</strong> {customer.gstin}
                  </p>
                )}
                {isValid(customer.dlno) && (
                  <p>
                    <strong>DL No:</strong> {customer.dlno}
                  </p>
                )}
                {isValid(customer.fssai) && (
                  <p>
                    <strong>FSSAI:</strong> {customer.fssai}
                  </p>
                )}
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
