import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import GenericSelect from "../GenericSelect"
import { Product } from "../../types/product"
import { InvoiceItem } from "../../types/invoiceItem"
import { FieldLabel } from "../ui/field"

type Props = {
  products: Product[]
  onAddItem: (item: Omit<InvoiceItem, "id" | "invoiceId">) => void
}

export default function CreateInvoiceItemDialog({ products, onAddItem }: Props) {
  const [open, setOpen] = useState(false)

  // Helper: Get current date in YYYY-MM-DD format
  const getToday = () => new Date().toISOString().split("T")[0]

  // Form state
  const [formData, setFormData] = useState({
    productId: 0,
    tradePrice: 0,
    batchNo: "",
    qty: 0,
    fqty: 0,
    mfg: getToday(),
    exp: getToday(),
    disc: 0,
    gst: 0,
  })

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    setFormData((prev) => ({
      ...prev,
      productId: product.id,
      tradePrice: product.ptd,
      gst: product.gst || 0,
    }))
  }

  // Handle text/number/date inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }))
  }

  // Calculate total
  const calculateTotal = () => {
    const { tradePrice, qty, disc, gst } = formData
    const taxable = tradePrice * qty - (tradePrice * qty * disc) / 100
    const total = taxable + (taxable * gst) / 100
    return isNaN(total) ? 0 : total
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productId) return alert("Please select a product")
    if (formData.qty <= 0) return alert("Quantity must be greater than 0")

    const taxableValue =
      formData.tradePrice * formData.qty -
      (formData.tradePrice * formData.qty * formData.disc) / 100

    const total = taxableValue + (taxableValue * formData.gst) / 100

    onAddItem({
      ...formData,
      mfg: new Date(formData.mfg),
      exp: new Date(formData.exp),
      taxableValue,
      total,
    })

    // Reset form
    setFormData({
      productId: 0,
      tradePrice: 0,
      batchNo: "",
      qty: 0,
      fqty: 0,
      mfg: getToday(),
      exp: getToday(),
      disc: 0,
      gst: 0,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">+ Invoice Items</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Invoice Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Product */}
          <div>
            <FieldLabel>Product</FieldLabel>
            <GenericSelect
              selectType="products"
              options={products}
              onSelect={handleSelectProduct}
            />
          </div>
          {/* Trade price & quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Trade Price</FieldLabel>
              <Input
                required
                readOnly
                type="number"
                name="tradePrice"
                value={formData.tradePrice}
                onChange={handleChange}
              />
            </div>

            <div>
                <FieldLabel>Batch No</FieldLabel>
                <Input 
                    required
                    type="string"
                    name="batchNo"
                    placeholder="BATCH105"
                    id="batchNo"
                    value={formData.batchNo}
                    onChange={handleChange}
                />
            </div>
            
            <div>
              <FieldLabel>Quantity</FieldLabel>
              <Input
                required
                type="number"
                min="1"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
              />
            </div>
            {/* fqty */}
            <div>
              <FieldLabel>Free Qty</FieldLabel>
              <Input
                type="number"
                name="fqty"
                value={formData.fqty}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mfg, Exp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Mfg</FieldLabel>
              <Input
                required
                type="date"
                name="mfg"
                value={formData.mfg}
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>Exp</FieldLabel>
              <Input
                required
                type="date"
                name="exp"
                value={formData.exp}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <FieldLabel>Discount (%)</FieldLabel>
            <Input
              type="number"
              name="disc"
              value={formData.disc}
              onChange={handleChange}
            />
          </div>

          {/* Total Preview */}
          <div className="border rounded-lg p-3 text-sm text-right font-medium">
            Total: ₹{calculateTotal().toFixed(2)}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
