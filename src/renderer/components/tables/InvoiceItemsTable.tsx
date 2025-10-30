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
    igst: number // 👈 added back
    setSubTotal: (value: number) => void
    setGrandTotal: (value: number) => void
}

export default function InvoiceItemsTable({
    products,
    invoiceItems,
    igst, // 👈 include here
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
            const taxable = total / (1 + gst / 100)
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

    return (
        <div className="mt-8">
            <h2 className="text-center text-xl font-semibold mb-4 print:text-lg print:mb-2">
                Items Details
            </h2>

            {/* Main Table */}
            <div className="border rounded-md overflow-hidden print:border-none print:rounded-none">
                <Table className="w-full text-sm print:text-xs invoice-print-table">
                    <TableHeader className="bg-gray-50 print:bg-gray-100">
                        <TableRow className="border-b border-gray-200 print:border-b-1 print:border-black">
                            <TableHead className="px-3 py-2 text-left font-semibold text-gray-700 print:px-2 print:py-1">Sl.No</TableHead>
                            <TableHead className="px-3 py-2 text-left font-semibold text-gray-700 print:px-2 print:py-1">Product Name</TableHead>
                            <TableHead className="px-3 py-2 text-left font-semibold text-gray-700 print:px-2 print:py-1">HSN</TableHead>
                            <TableHead className="px-3 py-2 text-left font-semibold text-gray-700 print:px-2 print:py-1">UOM</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">Qty</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">F.Qty</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">Exp</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">MRP</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">PTD</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">GST%</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">Disc%</TableHead>
                            <TableHead className="px-3 py-2 text-right font-semibold text-gray-700 print:px-2 print:py-1">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={15} className="text-center py-4 italic text-gray-500">
                                    No items added
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoiceItems.map((item, idx) => {
                                const product = products.find((p) => p.id === item.productId)
                                const gst = product?.gst || 0
                                return (
                                    <TableRow
                                        key={idx}
                                        className="border-b last:border-b-0 border-gray-100 print:border-b-1 print:border-gray-200"
                                    >
                                        <TableCell className="px-3 py-2 print:px-2 print:py-1">{idx + 1}</TableCell>
                                        <TableCell className="px-3 py-2 print:px-2 print:py-1">{product?.productCD}</TableCell>
                                        <TableCell className="px-3 py-2 print:px-2 print:py-1">{product?.hsn}</TableCell>
                                        <TableCell className="px-3 py-2 print:px-2 print:py-1">{product?.uom}</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{item.qty}</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{item.fqty}</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">
                                            {new Date(item.exp).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{product?.mrp.toFixed(2)}</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{product?.ptd.toFixed(2)}</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{gst}%</TableCell>
                                        <TableCell className="px-3 py-2 text-right print:px-2 print:py-1">{item.disc}%</TableCell>
                                        <TableCell className="px-3 py-2 text-right font-medium print:px-2 print:py-1">
                                            {item.total.toFixed(2)}
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
                <table className="w-auto text-sm border-t border-l border-r border-gray-200 print:text-xs print:border-t print:border-l print:border-r print:border-black">
                    <tbody>
                        <tr className="border-b border-gray-100 print:border-b-1 print:border-gray-200">
                            <td className="px-4 py-2 font-semibold text-gray-700 print:px-3 print:py-1">Total Taxable Value</td>
                            <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                                {totalTaxable.toFixed(2)}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100 print:border-b-1 print:border-gray-200">
                            <td className="px-4 py-2 font-semibold text-gray-700 print:px-3 print:py-1">Total Tax Amount</td>
                            <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                                {totalTaxAmount.toFixed(2)}
                            </td>
                        </tr>

                        {/* 👇 Conditionally show IGST row */}
                        {igst > 0 && (
                            <tr className="border-b border-gray-100 print:border-b-1 print:border-gray-200">
                                <td className="px-4 py-2 font-semibold text-gray-700 print:px-3 print:py-1">IGST (%)</td>
                                <td className="px-4 py-2 text-right font-medium print:px-3 print:py-1">
                                    {igst.toFixed(2)}
                                </td>
                            </tr>
                        )}

                        <tr className="bg-gray-50 print:bg-gray-100 font-bold">
                            <td className="px-4 py-2 text-gray-800 print:px-3 print:py-1">Grand Total</td>
                            <td className="px-4 py-2 text-right text-gray-800 print:px-3 print:py-1">
                                {grandTotal.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
