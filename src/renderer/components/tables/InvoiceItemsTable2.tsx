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
  igst: number // 👈 Added IGST support
  setSubTotal: (value: number) => void
  setGrandTotal: (value: number) => void
  onDelete: (index: number) => void
}

export default function InvoiceItemsTable2({
  products,
  invoiceItems,
  igst, // 👈 include IGST here
  setSubTotal,
  setGrandTotal,
  onDelete,
}: Props) {
  const [localItems, setLocalItems] = useState(invoiceItems)
  const [subTotal, updateSubTotal] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [grandTotal, updateGrandTotal] = useState(0)

  // Update local copy when invoiceItems prop changes
  useEffect(() => {
    setLocalItems(invoiceItems)
  }, [invoiceItems])

  // Calculate totals
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

    // ✅ Correct IGST percentage logic
    const igstAmount = igst > 0 ? (totalTaxable * igst) / 100 : 0
    const grandWithIGST = totalGrand + igstAmount

    updateGrandTotal(grandWithIGST)
    setGrandTotal(grandWithIGST)
  }, [localItems, products, igst])


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
              <TableHead className="border print:border-black px-2 py-1">Sl.No</TableHead>
              <TableHead className="border print:border-black px-2 py-1">Product Code</TableHead>
              <TableHead className="border print:border-black px-2 py-1">HSN</TableHead>
              <TableHead className="border print:border-black px-2 py-1">UOM</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">Qty</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">F.Qty</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">Exp</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">MRP</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">PTR</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">PTS</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">PTD</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">GST%</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">Disc%</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1">Taxable Value</TableHead>
              <TableHead className="text-right border print:border-black px-2 py-1 font-semibold">Total</TableHead>
              <TableHead className="text-center border print:border-black px-2 py-1 print:hidden">
                Manage
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={16}
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
                    <TableCell className="border print:border-black px-2 py-1">{idx + 1}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1">{product?.productCD}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1">{product?.hsn}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1">{product?.uom}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{item.qty}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{item.fqty}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">
                      {new Date(item.exp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{product?.mrp.toFixed(2)}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{product?.ptr.toFixed(2)}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{product?.pts.toFixed(2)}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{product?.ptd.toFixed(2)}</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{product?.gst}%</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{item.disc}%</TableCell>
                    <TableCell className="border print:border-black px-2 py-1 text-right">{taxableValue.toFixed(2)}</TableCell>
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
{/* Footer Totals */}
<div className="flex justify-end mt-3 pr-2 print:mt-1">
  <table className="border print:border-black text-sm print:text-xs">
    <tbody>
      <tr>
        <td className="px-3 py-1 border print:border-black font-semibold">
          Total Taxable Value
        </td>
        <td className="px-3 py-1 border print:border-black text-right">
          {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
      </tr>
      <tr>
        <td className="px-3 py-1 border print:border-black font-semibold">
          Total Tax Amount
        </td>
        <td className="px-3 py-1 border print:border-black text-right">
          {taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
      </tr>

      {/* 👇 Show IGST only if applicable */}
      {igst > 0 && (
        <>
          <tr>
            <td className="px-3 py-1 border print:border-black font-semibold">
              IGST (%)
            </td>
            <td className="px-3 py-1 border print:border-black text-right">
              {igst.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-1 border print:border-black font-semibold">
              IGST Amount
            </td>
            <td className="px-3 py-1 border print:border-black text-right">
              {((subTotal * igst) / 100).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        </>
      )}

      <tr className="bg-gray-100 print:bg-transparent">
        <td className="px-3 py-1 border print:border-black font-bold">
          Grand Total (incl. GST{igst > 0 ? " + IGST" : ""})
        </td>
        <td className="px-3 py-1 border print:border-black text-right font-bold">
          {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  )
}
