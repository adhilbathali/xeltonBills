import { useEffect, useState } from "react"
import GenericSelect from "../GenericSelect"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { PurchaseItem } from "@/renderer/types/purchaseItem"
import { Product } from "@/renderer/types/product"
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { EditIcon, Gift, Hash, IndianRupeeIcon, PercentCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Props = {
  onEdit: (purchaseItem: PurchaseItem) => void;
  purchaseItem: PurchaseItem;
  products: Product[];
}

export default function EditPurchaseItemDialog({ onEdit, purchaseItem, products }: Props) {

  const [open, setOpen] = useState<boolean>(false)
  const prevProduct = products.find(p => p.id === purchaseItem.productId)
  const [product, setProduct] = useState<Product>(prevProduct)
  const [formData, setFormData] = useState<PurchaseItem>({
    id: null,
    productId: product.id,
    purchaseId: null,
    purchaseRate: null,
    qty: null,
    fqty: null,
    total: null,
    disc: null,
  })

  const handleSelect = (selectedProduct: Product) => {
    // Update local product state
    setProduct(selectedProduct);

    // Also update product so the form fields show this product’s data
    setFormData((prev) => ({
      ...prev,
      productId: selectedProduct.id,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
    setOpen(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? null : parseFloat(value);

    setFormData((prev) => {
        let updatedForm = { ...prev };
        updatedForm = {
          ...prev,
          [name]: numericValue,
        };

      // Calculate total safely
      const purchaseRate = updatedForm.purchaseRate ?? 0;
      const qty = updatedForm.qty ?? 0;
      const fqty = updatedForm.fqty ?? 0;
      const disc = updatedForm.disc ?? 0;

      const total = Number(((qty) * purchaseRate * ((100 - disc) / 100)).toFixed(2));

      return {
        ...updatedForm,
        total: total,
      };
    });
  };
  useEffect(() => {
    setFormData(purchaseItem)
  }, [purchaseItem])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger><Button variant="ghost" className="hover:bg-slate-200"><EditIcon className="text-blue-400" />
      </Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Purchase Item</DialogTitle>
          <DialogDescription>
            Select the product and enter the entry details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="selectProduct">Select Product</FieldLabel>
                <GenericSelect id="selectProduct" options={products} onSelect={handleSelect} selectType="products" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                {/* Product Code & Description */}
                <Field>
                  <FieldLabel htmlFor="productCD">Product code & Description</FieldLabel>
                  <Input readOnly required
                    id="productCD"
                    name="productCD"
                    type="text"
                    placeholder="eye drops 102"
                    value={product.productCD}
                    onChange={handleChange}
                  />
                </Field>
                {/* HSN */}
                <Field>
                  <FieldLabel htmlFor="hsn">HSN</FieldLabel>
                  <Input readOnly required
                    id="hsn"
                    name="hsn"
                    autoComplete="off"
                    placeholder="HSN3004"
                    value={product.hsn}
                    onChange={handleChange}
                  />
                </Field>

                {/* UOM */}
                <Field>
                  <FieldLabel htmlFor="uom">UOM</FieldLabel>
                  <Select disabled>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={product.uom || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bottle">Bottle</SelectItem>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Strip">Strip</SelectItem>
                      <SelectItem value="Pack">Pack</SelectItem>
                      <SelectItem value="Piece">Piece</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {/* EXP */}
                <Field>
                  <FieldLabel htmlFor="exp">EXP</FieldLabel>
                  <Input
                    type="date"
                    id="exp"
                    name="exp"
                    required
                    value={product.exp.toISOString().split("T")[0]}
                  />
                </Field>

                {/* MRP */}
                <Field>
                  <FieldLabel htmlFor="mrp">
                    <span className="flex justify-center items-center">
                      MRP (<IndianRupeeIcon size={15} />)
                    </span>
                  </FieldLabel>
                  <Input readOnly required
                    id="mrp"
                    name="mrp"
                    type="number"
                    autoComplete="off"
                    placeholder="890"
                    value={product.mrp ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* GST */}
                <Field>
                  <FieldLabel htmlFor="gst">GST (%)</FieldLabel>
                  <Input readOnly required
                    id="gst"
                    name="gst"
                    type="number"
                    autoComplete="off"
                    placeholder="5"
                    value={product.gst ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* PTR */}
                <Field>
                  <FieldLabel htmlFor="ptr">
                    <span className="flex justify-center items-center">
                      PTR (<IndianRupeeIcon size={15} />)
                    </span>
                  </FieldLabel>
                  <Input readOnly required
                    id="ptr"
                    name="ptr"
                    type="number"
                    autoComplete="off"
                    placeholder="price to retail"
                    value={product.ptr ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* PTS */}
                <Field>
                  <FieldLabel htmlFor="pts">
                    <span className="flex justify-center items-center">
                      PTS (<IndianRupeeIcon size={15} />)
                    </span>
                  </FieldLabel>
                  <Input readOnly required
                    id="pts"
                    name="pts"
                    type="number"
                    autoComplete="off"
                    placeholder="price to stockiest"
                    value={product.pts ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* Purchase Rate */}
                <Field>
                  <FieldLabel htmlFor="purchaseRate">
                    <span className="flex justify-center items-center">
                      Purchase Rate (<IndianRupeeIcon size={15} />)
                    </span>
                  </FieldLabel>
                  <Input
                    required
                    id="purchaseRate"
                    name="purchaseRate"
                    type="number"
                    placeholder="Price from supplier"
                    value={formData.purchaseRate ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* Quantity */}
                <Field>
                  <FieldLabel htmlFor="qty">
                    <span className="flex justify-center items-center gap-1">
                      QTY <Hash size={15} />
                    </span>
                  </FieldLabel>
                  <Input
                    required
                    id="qty"
                    name="qty"
                    type="number"
                    placeholder="Quantity"
                    value={formData.qty ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* Free Quantity */}
                <Field>
                  <FieldLabel htmlFor="fqty">
                    <span className="flex justify-center items-center gap-1">
                      f.qty <Gift size={15} />
                    </span>
                  </FieldLabel>
                  <Input
                    required
                    id="fqty"
                    name="fqty"
                    type="number"
                    placeholder="Free Quantity"
                    value={formData.fqty ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* Discount */}
                <Field>
                  <FieldLabel htmlFor="disc">
                    <span className="flex justify-center items-center gap-1">
                      disc <PercentCircle className="font-black" size={15} />
                    </span>
                  </FieldLabel>
                  <Input
                    required
                    id="disc"
                    name="disc"
                    type="number"
                    placeholder="Discount from supplier"
                    value={formData.disc ?? ""}
                    onChange={handleChange}
                  />
                </Field>

                {/* Total */}
                <Field>
                  <FieldLabel htmlFor="total">
                    <span className="flex justify-center items-center">
                      Total (<IndianRupeeIcon size={15} />)
                    </span>
                  </FieldLabel>
                  <Input
                    readOnly
                    required
                    id="total"
                    name="total"
                    type="number"
                    placeholder="Entry Total Value"
                    value={formData.total ?? ""}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2"></div>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}