import { PurchaseItem } from "@/renderer/types/purchaseItem"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import EditPurchaseEntryDialog from "../dialogs/EditPurchaseItemDialog";
import { Product } from "@/renderer/types/product";

type Props = {
  purchaseItems: PurchaseItem[];
  onDelete: (id: number) => void;
  onEdit: (purchaseItem: PurchaseItem) => void;
  products: Product[]
}

export default function PurchaseItemsTable({ purchaseItems, onDelete, onEdit, products }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center bg-slate-50">Sl.No</TableHead>
          <TableHead className="text-center bg-slate-50">Product Code & Description</TableHead>
          <TableHead className="text-center bg-slate-50">HSN</TableHead>
          <TableHead className="text-center bg-slate-50">UOM</TableHead>
          <TableHead className="text-center bg-slate-50">MRP</TableHead>
          <TableHead className="text-center bg-slate-50">PTR</TableHead>
          <TableHead className="text-center bg-slate-50">PTS</TableHead>
          <TableHead className="text-center bg-slate-50">GST</TableHead>
          <TableHead className="text-center bg-slate-50">Purchase Rate</TableHead>
          <TableHead className="text-center bg-slate-50">QTY</TableHead>
          <TableHead className="text-center bg-slate-50">F.QTY</TableHead>
          <TableHead className="text-center bg-slate-50">Disc</TableHead>
          <TableHead className="text-center bg-slate-50">Total</TableHead>
          <TableHead className="text-center bg-slate-50">Manage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
  {purchaseItems.map((item, index) => {
    const product = products.find(p => p.id === item.productId)

    return ( // ✅ You must return JSX here
      <TableRow key={item.id}>
        <TableCell className="text-center">{index + 1}</TableCell>
        <TableCell className="text-center">{product?.productCD || "Unknown"}</TableCell>
        <TableCell className="text-center">{product?.hsn || "-"}</TableCell>
        <TableCell className="text-center">{product?.uom || "-"}</TableCell>
        <TableCell className="text-center">{product?.mrp || "-"}</TableCell>
        <TableCell className="text-center">{product?.ptr || "-"}</TableCell>
        <TableCell className="text-center">{product?.pts || "-"}</TableCell>
        <TableCell className="text-center">{product?.gst || "-"}</TableCell>
        <TableCell className="text-center">{item.purchaseRate}</TableCell>
        <TableCell className="text-center">{item.qty}</TableCell>
        <TableCell className="text-center">{item.fqty}</TableCell>
        <TableCell className="text-center">{item.disc}</TableCell>
        <TableCell className="text-center">{item.total}</TableCell>
        <TableCell className="text-center flex justify-center gap-2">
          <EditPurchaseEntryDialog products={products} purchaseItem={item} onEdit={onEdit} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
          >
            <Trash2Icon className="h-4 w-4 text-red-400" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })}
</TableBody>

    </Table>
  )
}