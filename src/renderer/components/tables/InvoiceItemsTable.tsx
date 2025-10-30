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
    igst: number
    setSubTotal: (value: number) => void
    setGrandTotal: (value: number) => void
}

export default function InvoiceItemsTable({
    products,
    invoiceItems,
    igst,
    setSubTotal,
    setGrandTotal,
}: Props) {
    const [subTotal, updateSubTotal] = useState(0)
    const [igstAmount, setIgstAmount] = useState(0)
    const [grandTotal, updateGrandTotal] = useState(0)

    useEffect(() => {
        let sub = 0
        for (const item of invoiceItems) {
            sub += item.total
        }

        const igstAmt = (sub * igst) / 100
        const grand = sub + igstAmt

        updateSubTotal(sub)
        setSubTotal(sub)
        setIgstAmount(igstAmt)
        updateGrandTotal(grand)
        setGrandTotal(grand)
    }, [invoiceItems, igst])

    return (
        <div className="mt-4 print:border-t print:border-black">
            <h2 className="text-center text-lg font-semibold mb-2 print:mb-1">
                Invoice Items
            </h2>
            <div className="overflow-x-auto border rounded-md print:border-none print:overflow-visible">
                <Table className="min-w-full border-collapse text-sm print:text-xs">
                    <TableHeader className="bg-gray-100 print:bg-transparent">
                        <TableRow className="border print:border-black">
                            <TableHead className="text-left border print:border-black px-2 py-1">Sl.No</TableHead>
                            <TableHead className="text-left border print:border-black px-2 py-1">Product Code</TableHead>
                            <TableHead className="text-left border print:border-black px-2 py-1">HSN</TableHead>
                            <TableHead className="text-left border print:border-black px-2 py-1">UOM</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">Qty</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">F.Qty</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">Exp</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">MRP</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">PTR</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">PTS</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">GST%</TableHead>
                            <TableHead className="text-right border print:border-black px-2 py-1">Disc%</TableHead>
                            {/* <TableHead className="text-right border print:border-black px-2 py-1">Trade Price / unit</TableHead> */}
                            <TableHead className="text-right border print:border-black px-2 py-1">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceItems.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={14}
                                    className="text-center py-4 italic text-gray-500 print:hidden"
                                >
                                    No items added
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoiceItems.map((item, idx) => {
                                const product = products.find((p) => p.id === item.productId)
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
                                        <TableCell className="border print:border-black px-2 py-1 text-right">{product?.gst}%</TableCell>
                                        <TableCell className="border print:border-black px-2 py-1 text-right">{item.disc}%</TableCell>
                                        {/* <TableCell className="border print:border-black px-2 py-1 text-right">{item.tradePrice.toFixed(2)}</TableCell> */}
                                        <TableCell className="border print:border-black px-2 py-1 text-right font-medium">
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
            <div className="flex justify-end mt-3 pr-2 print:mt-1">
                <table className="border print:border-black text-sm print:text-xs">
                    <tbody>
                        <tr>
                            <td className="px-3 py-1 border print:border-black font-semibold">Subtotal</td>
                            <td className="px-3 py-1 border print:border-black text-right">{subTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="px-3 py-1 border print:border-black font-semibold">IGST (%)</td>
                            <td className="px-3 py-1 border print:border-black text-right">{igst}</td>
                        </tr>
                        <tr>
                            <td className="px-3 py-1 border print:border-black font-semibold">IGST Amount</td>
                            <td className="px-3 py-1 border print:border-black text-right">{igstAmount.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-gray-100 print:bg-transparent">
                            <td className="px-3 py-1 border print:border-black font-bold">Grand Total</td>
                            <td className="px-3 py-1 border print:border-black text-right font-bold">{grandTotal.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
