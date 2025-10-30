import { IndianRupeeIcon, Trash2Icon, EditIcon, DeleteIcon, ViewIcon, LucideView, EyeIcon } from "lucide-react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { Button } from "../ui/button"

export default function InvoicesTable() {
    return (
        <>
            <Table className="mb-20 w-4/5 justify-self-center">
                <TableCaption>List of all invoices</TableCaption>
                <TableHeader className="h-20">
                    <TableRow>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Invoice</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Customer</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Date</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Due Date</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Amount</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Status</div></TableHead>
                        <TableHead><div className="flex justify-center items-center h-20 text-center">Manage</div></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="text-center">INV0001</TableCell>
                        <TableCell className="text-center">John pharma</TableCell>
                        <TableCell className="text-center">12/30/2024</TableCell>
                        <TableCell className="text-center">12/30/2024</TableCell>
                        <TableCell className="text-center">40000</TableCell>
                        <TableCell className="text-center">Pending</TableCell>
                        <TableCell className="text-center">
                            <Button className="hover:bg-slate-200" variant="ghost"><Trash2Icon className="text-red-400" /></Button>
                            <Button className="hover:bg-slate-200" variant="ghost"><EditIcon className="text-blue-400" /></Button>
                            <Button className="hover:bg-slate-200" variant="ghost"><EyeIcon className="text-slate-500" /></Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}