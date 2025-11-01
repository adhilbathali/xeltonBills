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

type Props = {
  products: Product[]
  invoiceItems: (InvoiceItem & { id?: number })[]
  setSubTotal: (value: number) => void
  setGrandTotal: (value: number) => void
}

export default function InvoiceItemsTable({
  products,
  invoiceItems,
  setSubTotal,
  setGrandTotal,
}: Props) {
  const [totalTaxable, setTotalTaxable] = useState(0)
  const [totalTaxAmount, setTotalTaxAmount] = useState(0)
  const [grandTotal, setLocalGrandTotal] = useState(0)

  useEffect(() => {
    let taxableSum = 0
    let taxSum = 0
    let totalSum = 0

    for (const item of invoiceItems) {
      const product = products.find((p) => p.id === item.productId)
      const gst = product?.gst || 0
      const total = item.total
      const taxable = item.taxableValue ?? total / (1 + gst / 100)
      const taxAmount = total - taxable

      taxableSum += taxable
      taxSum += taxAmount
      totalSum += total
    }

    setTotalTaxable(taxableSum)
    setTotalTaxAmount(taxSum)
    setLocalGrandTotal(totalSum)
    setSubTotal(taxableSum)
    setGrandTotal(totalSum)
  }, [invoiceItems, products, setSubTotal, setGrandTotal])

  const format = (num: number) =>
    num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="mt-8">
      <h2 className="text-center text-xl font-semibold mb-4 print:text-lg print:mb-2">
        Item Details
      </h2>

      {/* Main Table */}
      <div className="border rounded-md overflow-hidden print:border-none print:rounded-none">
        <Table className="w-full text-sm print:text-xs invoice-print-table">
          <TableHeader className="bg-gray-50 print:bg-gray-100">
            <TableRow className="border-b border-gray-200 print:border-b-1 print:border-black">
              {[
                "Sl.No",
                "Product Name",
                "HSN",
                "Batch No",
                "Mfg",
                "Exp",
                "Qty",
                "F.Qty",
                "UOM",
                "Rate",
                "Disc%",
                "Taxable Value",
                "GST%",
                "GST Amount",
                "Total",
              ].map((head, i) => (
                <TableHead
                  key={i}
                  className="px-3 py-2 font-semibold text-black text-left print:px-2 print:py-1"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoiceItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={15}
                  className="text-center py-4 italic text-gray-500"
                >
                  No items added
                </TableCell>
              </TableRow>
            ) : (
              invoiceItems.map((item, idx) => {
                const product = products.find((p) => p.id === item.productId)
                const gst = product?.gst || 0
                const taxable = item.taxableValue ?? item.total / (1 + gst / 100)
                const gstAmount = item.total - taxable

                return (
                  <TableRow
                    key={idx}
                    className="border-b last:border-b-0 border-gray-100 print:border-b-1 print:border-gray-200"
                  >
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {product?.productCD}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {product?.hsn}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {item.batchNo || "-"}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {new Date(item.mfg).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {new Date(item.exp).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {item.qty}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {item.fqty}
                    </TableCell>
                    <TableCell className="px-3 py-2 print:px-2 print:py-1">
                      {product?.uom}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {format(item.tradePrice)}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {item.disc}%
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right font-medium print:px-2 print:py-1">
                      {format(taxable)}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {gst}%
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                      {format(gstAmount)}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right font-semibold print:px-2 print:py-1">
                      {format(item.total)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Totals */}
      <div className="flex justify-end mt-6 pr-2 print:mt-4">
        <table className="w-auto text-sm border border-gray-300 rounded-md print:text-xs print:border-black invoice-totals">
          <tbody>
            <tr className="border-b border-gray-200 print:border-b-1 print:border-gray-300">
              <td className="px-4 py-2 font-semibold text-black print:px-3 print:py-1">
                Total Taxable Value
              </td>
              <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                ₹ {format(totalTaxable)}
              </td>
            </tr>

            <tr className="border-b border-gray-200 print:border-b-1 print:border-gray-300">
              <td className="px-4 py-2 font-semibold text-black print:px-3 print:py-1">
                CGST Amount
              </td>
              <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                ₹ {format(totalTaxAmount / 2)}
              </td>
            </tr>
            <tr className="border-b border-gray-200 print:border-b-1 print:border-gray-300">
              <td className="px-4 py-2 font-semibold text-black print:px-3 print:py-1">
                SGST Amount
              </td>
              <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                ₹ {format(totalTaxAmount / 2)}
              </td>
            </tr>

            <tr className="bg-gray-100 print:bg-transparent font-bold">
              <td className="px-4 py-2 text-lg text-black print:px-3 print:py-1">
                Bill Amount (Incl. GST)
              </td>
              <td className="px-4 py-2 text-lg text-right text-black print:px-3 print:py-1">
                ₹ {format(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
