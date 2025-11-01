import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Product } from "@/renderer/types/product"
import { InvoiceItem } from "@/renderer/types/invoiceItem"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"

type Props = {
  products: Product[]
  invoiceItems: (InvoiceItem & { id?: number })[]
  setSubTotal: (value: number) => void
  setGrandTotal: (value: number) => void
  onDelete: (index: number) => void
}

export default function InvoiceItemsTable2({
  products,
  invoiceItems,
  setSubTotal,
  setGrandTotal,
  onDelete,
}: Props) {
  const [localItems, setLocalItems] = useState(invoiceItems)
  const [subTotal, updateSubTotal] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [grandTotal, updateGrandTotal] = useState(0)

  useEffect(() => {
    setLocalItems(invoiceItems)
  }, [invoiceItems])

  useEffect(() => {
    let totalTaxable = 0
    let totalTax = 0
    let totalGrand = 0

    for (const item of localItems) {
      const product = products.find((p) => p.id === item.productId)
      const gst = product?.gst || 0
      const taxable = item.taxableValue ?? 0
      const gstAmt = (taxable * gst) / 100
      const total = taxable + gstAmt

      totalTaxable += taxable
      totalTax += gstAmt
      totalGrand += total
    }

    updateSubTotal(totalTaxable)
    setSubTotal(totalTaxable)
    setTaxAmount(totalTax)
    updateGrandTotal(totalGrand)
    setGrandTotal(totalGrand)
  }, [localItems, products])

  const handleDelete = (index: number) => {
    onDelete(index)
  }

  return (
    <div className="mt-4 print:border-t print:border-black">
      <h2 className="text-center text-lg font-semibold mb-2 print:mb-1">
        Invoice Items
      </h2>

      <div className="overflow-x-auto border rounded-md print:border-none print:overflow-visible">
        <Table className="min-w-full border-collapse text-sm print:text-xs">
          <TableHeader className="bg-gray-100 print:bg-transparent">
            <TableRow className="border print:border-black">
              {[
                "Sl.No",
                "Product Code",
                "HSN",
                "Batch No",
                "MFG",
                "Exp",
                "UOM",
                "Qty",
                "F.Qty",
                "MRP",
                "PTR",
                "PTS",
                "PTD",
                "GST%",
                "Disc%",
                "Taxable Value",
                "Total",
                "Manage",
              ].map((head, i) => (
                <TableHead
                  key={i}
                  className={`border print:border-black px-2 py-1 ${
                    head === "Manage" ? "text-center print:hidden" : "text-right"
                  }`}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {localItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={18}
                  className="text-center py-4 italic text-gray-500 print:hidden"
                >
                  No items added
                </TableCell>
              </TableRow>
            ) : (
              localItems.map((item, idx) => {
                const product = products.find((p) => p.id === item.productId)
                const taxableValue = item.taxableValue ?? 0
                const total = item.total ?? 0
                return (
                  <TableRow key={idx} className="border print:border-black">
                    <TableCell className="border print:border-black px-2 py-1 text-center">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-left">
                      {product?.productCD}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-left">
                      {product?.hsn}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-left">
                      {item.batchNo || "-"}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {item.mfg ? new Date(item.mfg).toLocaleDateString("en-GB") : "-"}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {item.exp ? new Date(item.exp).toLocaleDateString("en-GB") : "-"}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-left">
                      {product?.uom}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {item.qty}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {item.fqty}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {product?.mrp.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {product?.ptr.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {product?.pts.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {product?.ptd.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {product?.gst}%
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {item.disc ?? 0}%
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {taxableValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right font-medium">
                      {total.toFixed(2)}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-center print:hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(idx)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Totals */}
      <div className="flex justify-end mt-3 pr-2 print:mt-1">
        <table className="border print:border-black text-sm print:text-xs">
          <tbody>
            <tr>
              <td className="px-3 py-1 border print:border-black font-semibold">
                Total Taxable Value
              </td>
              <td className="px-3 py-1 border print:border-black text-right">
                ₹ {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>

            <tr>
              <td className="px-3 py-1 border print:border-black font-semibold">
                CGST Amount
              </td>
              <td className="px-3 py-1 border print:border-black text-right">
                ₹ {(taxAmount / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>

            <tr>
              <td className="px-3 py-1 border print:border-black font-semibold">
                SGST Amount
              </td>
              <td className="px-3 py-1 border print:border-black text-right">
                ₹ {(taxAmount / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>

            <tr className="bg-gray-100 print:bg-transparent">
              <td className="px-3 py-1 border print:border-black font-bold">
                Bill Amount (Incl. GST)
              </td>
              <td className="px-3 py-1 border print:border-black text-right font-bold">
                ₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
