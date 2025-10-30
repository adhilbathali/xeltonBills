import { CANDF } from "@/renderer/types/cAndF"
import { PurchaseMaster } from "@/renderer/types/purchaseMaster"

type Props = {
  suppliers: CANDF[];
  purchaseMaster: PurchaseMaster;
}

export default function PurchaseHeader({ suppliers, purchaseMaster }: Props) {
  const supplier = suppliers.find(s => s.id === purchaseMaster.supplierId)

  if (!supplier) {
    return (
      <div className="w-full border rounded-lg bg-white text-gray-700 p-4 text-center text-sm">
        <p>Header details will appear here once the supplier is selected.</p>
      </div>
    )
  }

  return (
    <div className="w-full border rounded-lg bg-white text-gray-900 p-6">
      {/* Top Row: Invoice + Dates */}
      <div className="flex justify-between border-b pb-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold">Purchase Invoice</h2>
          <p className="text-sm text-gray-700">
            Invoice No: <span className="font-medium">{purchaseMaster.invoiceNumber}</span>
          </p>
        </div>

        <div className="text-sm text-right">
          <p>
            <span className="font-medium">Purchase Date:</span>{" "}
            {purchaseMaster.PODate.toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Due Date:</span>{" "}
            {purchaseMaster.dueDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Supplier Details Section */}
      <div className="grid grid-cols-2 gap-y-1 text-sm">
        <div>
          <p className="font-medium text-gray-900">{supplier.companyName}</p>
          <p className="text-gray-700">{supplier.companyAddress}</p>
        </div>

        <div className="text-right">
          <p>
            <span className="font-medium">Email:</span> {supplier.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {supplier.phone}
          </p>
        </div>

        <p>
          <span className="font-medium">GSTIN:</span> {supplier.gstin}
        </p>
        <p className="text-right">
          <span className="font-medium">PAN:</span> {supplier.pan}
        </p>
      </div>
    </div>
  )
}
