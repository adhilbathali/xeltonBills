import { useState, useEffect } from "react"
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
import { CANDF } from "@/renderer/types/cAndF"
import { PurchaseMaster } from "@/renderer/types/purchaseMaster"
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"

type Props = {
  onAdd: (purchaseMaster: PurchaseMaster) => void
  suppliers: CANDF[]
}

export default function CreatePurchaseMasterDialog({ onAdd, suppliers }: Props) {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState<PurchaseMaster>({
    id: null,
    supplierId: null,
    PODate: new Date(),
    dueDate: new Date(),
    igst: 0,
    invoiceNumber: "",
    subTotal: 0,
    grandTotal: 0,
  })

  // ✅ keep supplier state only for UI if needed
  const [selectedSupplier, setSelectedSupplier] = useState<CANDF | null>(null)

  // ✅ Automatically update grand total whenever IGST or subTotal changes
  useEffect(() => {
    const igstPercent = Number(formData.igst) || 0
    const grandTotal = Number(formData.subTotal) * (1 + igstPercent / 100)
    setFormData((prev) => ({ ...prev, grandTotal }))
  }, [formData.subTotal, formData.igst])

  const handleSelect = (supplier: CANDF) => {
    setSelectedSupplier(supplier)
    setFormData((prev) => ({ ...prev, supplierId: supplier.id }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "igst" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.supplierId) {
      alert("Please select a supplier")
      return
    }

    onAdd(formData)

    // reset after save
    setFormData({
      id: null,
      supplierId: null,
      PODate: new Date(),
      dueDate: new Date(),
      igst: 0,
      invoiceNumber: "",
      subTotal: 0,
      grandTotal: 0,
    })

    setSelectedSupplier(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Header</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Header</DialogTitle>
          <DialogDescription>
            This information will be used in the purchase bill header.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                {/* Invoice Number */}
                <Field>
                  <FieldLabel>Invoice Number</FieldLabel>
                  <Input
                    type="text"
                    name="invoiceNumber"
                    placeholder="INV003"
                    required
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                  />
                </Field>

                {/* Supplier */}
                <Field>
                  <FieldLabel>Select Supplier</FieldLabel>
                  <GenericSelect
                    id="selectSupplier"
                    onSelect={handleSelect}
                    options={suppliers}
                    selectType="suppliers"
                  />
                  {selectedSupplier && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {selectedSupplier.companyName}
                    </p>
                  )}
                </Field>

                {/* Purchase Date */}
                <Field>
                  <FieldLabel>Purchase Date</FieldLabel>
                  <Input
                    type="date"
                    name="PODate"
                    value={formData.PODate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        PODate: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </Field>

                {/* Due Date */}
                <Field>
                  <FieldLabel>Due Date</FieldLabel>
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dueDate: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </Field>

                {/* IGST */}
                <Field>
                  <FieldLabel>IGST (%)</FieldLabel>
                  <Input
                    type="number"
                    name="igst"
                    value={formData.igst}
                    onChange={handleChange}
                    placeholder="12"
                    required
                  />
                </Field>

                {/* Subtotal */}
                <Field>
                  <FieldLabel>Sub Total</FieldLabel>
                  <Input
                    type="number"
                    name="subTotal"
                    value={formData.subTotal.toString()}
                    readOnly
                  />
                </Field>

                {/* Grand Total */}
                <Field>
                  <FieldLabel>Grand Total</FieldLabel>
                  <Input
                    type="number"
                    name="grandTotal"
                    value={formData.grandTotal.toFixed(2)}
                    readOnly
                  />
                </Field>
              </div>
            </FieldGroup>

            <DialogFooter className="mt-6">
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
