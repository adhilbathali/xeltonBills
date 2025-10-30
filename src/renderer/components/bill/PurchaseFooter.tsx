import { PurchaseMaster } from "@/renderer/types/purchaseMaster"

type Props = {
  purchaseMaster: PurchaseMaster;
}

export default function PurchaseFooter({ purchaseMaster }: Props) {
  const { subTotal, igst } = purchaseMaster;

  const taxAmount = (Number(subTotal) * Number(igst)) / 100;
  const grandTotal = Number(subTotal) + taxAmount;

  return (
    <div className="w-full border rounded-lg bg-white text-gray-900 p-6 mt-4">
      <div className="flex justify-end">
        <div className="w-full sm:w-1/2 md:w-1/3">
<div className="flex flex-col items-end gap-2 text-lg">
  <p>Subtotal: ₹{purchaseMaster.subTotal?.toFixed(2) || 0}</p>
  <p>IGST: {purchaseMaster.igst}%</p>
  <p className="font-bold text-xl">
    Grand Total: ₹{purchaseMaster.grandTotal?.toFixed(2) || 0}
  </p>
</div>

        </div>
      </div>
    </div>
  )
}
