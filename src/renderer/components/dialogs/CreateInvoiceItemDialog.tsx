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

type Props = {
    products: Product[]
    onAddItem: (item: Omit<InvoiceItem, "id" | "invoiceId">) => void
}

export default function CreateInvoiceItemDialog({ products, onAddItem }: Props) {
    const [open, setOpen] = useState(false)

    // Helper: get current date in YYYY-MM-DD format
    const getToday = () => new Date().toISOString().split("T")[0]

    const [formData, setFormData] = useState({
        productId: 0,
        tradePrice: 0,
        qty: 0,
        fqty: 0,
        exp: getToday(),
        disc: 0,
    })

    const handleSelectProduct = (product: Product) => {
        setFormData((prev) => ({ ...prev, productId: product.id, tradePrice: product.ptr }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "exp" ? value : parseFloat(value) || 0,
        }))
    }

    const calculateTotal = () => {
        const { tradePrice, qty, disc } = formData
        const total = tradePrice * qty - (tradePrice * qty * disc) / 100
        return isNaN(total) ? 0 : total
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Simple manual validation
        if (!formData.productId) return alert("Please select a product")
        if (formData.qty <= 0) return alert("Quantity must be greater than 0")

        const total = calculateTotal()
        onAddItem({
            ...formData,
            exp: new Date(formData.exp),
            total,
        })

        // Reset
        setFormData({
            productId: 0,
            tradePrice: 0,
            qty: 0,
            fqty: 0,
            exp: getToday(),
            disc: 0,
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

                {/* Wrap in form for proper validation */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <GenericSelect
                            selectType="products"
                            options={products}
                            onSelect={handleSelectProduct}
                        />
                    </div>

                    {/* Trade price & qty */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Trade Price</label>
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
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <Input
                                required
                                type="number"
                                min="1"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Free qty & expiry */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Free Qty</label>
                            <Input
                                type="number"
                                name="fqty"
                                value={formData.fqty}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry Date</label>
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
                        <label className="block text-sm font-medium mb-1">Discount (%)</label>
                        <Input
                            type="number"
                            name="disc"
                            value={formData.disc}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Total preview */}
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
