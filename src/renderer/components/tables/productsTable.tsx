import { IndianRupeeIcon, Trash2Icon, EditIcon } from "lucide-react"
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
import EditProductDialog from "../dialogs/EditProductDialog";
import { Product } from "@/renderer/types/product";

type Props = {
  products: Product[];
  onDelete: (productId: Product['id']) => void;
  onEdit: (product: Product) => void;
}

export default function ProductsTable({ products, onDelete, onEdit }: Props) {


  return (
    <>
      <Table className="mb-20">
        <TableCaption>List of all products in the inventory.</TableCaption>
        <TableHeader className="h-20">
          <TableRow>
            <TableHead className="text-center"><div className="flex justify-center items-center h-20 text-center">Sl.No.</div></TableHead>
            <TableHead className="text-center"><div className="text-wrap text-center">Product Code & Description</div></TableHead>
            <TableHead className="text-center"><div className="text-wrap text-center">HSN</div></TableHead>
            <TableHead className="text-center"><div className="text-wrap text-center w-15">UOM</div></TableHead>
            <TableHead className="text-center"><span className="flex justify-center items-center">MRP (<IndianRupeeIcon size={15} />)</span></TableHead>
            <TableHead className="text-center"><span className="flex justify-center items-center">PTR (<IndianRupeeIcon size={15} />)</span></TableHead>
            <TableHead className="text-center"><span className="flex justify-center items-center">PTS (<IndianRupeeIcon size={15} />)</span></TableHead>
            <TableHead className="text-center"><span className="flex justify-center items-center">PTD (<IndianRupeeIcon size={15} />)</span></TableHead>
            <TableHead className="text-center"><span className="flex justify-center items-center">GST (%)</span></TableHead>
            <TableHead className="text-center"><div className="text-wrap text-center">Manage</div></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">{product.productCD}</TableCell>
              <TableCell className="text-center">{product.hsn}</TableCell>
              <TableCell className="text-center">{product.uom.toString()}</TableCell>
              <TableCell className="text-center">{product.mrp.toString()}</TableCell>
              <TableCell className="text-center">{product.ptr.toString()}</TableCell>
              <TableCell className="text-center">{product.pts.toString()}</TableCell>
              <TableCell className="text-center">{product.ptd.toString()}</TableCell>
              <TableCell className="text-center">{product.gst.toString()}</TableCell>
              <TableCell className="text-center" >
                <Button onClick={() => onDelete(product.id)} className="hover:bg-slate-200" variant="ghost"><Trash2Icon className="text-red-400" /></Button>
                <EditProductDialog onEdit={onEdit} product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}