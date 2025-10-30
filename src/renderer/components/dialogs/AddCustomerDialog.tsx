import { useState } from "react"
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

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field"

import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Customer } from "@/renderer/types/customer"

type Props = {
  onAdd: (customer: Customer) => void
}

export default function AddCustomerDialog({ onAdd }: Props) {
  const [formData, setFormData] = useState<Customer>({
    id: null,
    companyName: "",
    address: "",
    email: "",
    phone: "",
    gstin: "",
    cin: "",
    fssai: "",
    pan: "",
    dlno: "",
    dlexp: new Date(),
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    onAdd(formData)

    // Reset the form
    setFormData({
      id: null,
      companyName: "",
      address: "",
      email: "",
      phone: "",
      gstin: "",
      cin:"",
      fssai: "",
      pan: "",
      dlno: "",
      dlexp: new Date(),
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Customer</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to your list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="ABC Traders"
                  autoComplete="off"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Street, City"
                  required
                />
              </Field>

            <div className="grid grid-cols-2 gap-10">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  autoComplete="off"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="off"
                  required
                />
              </Field>
              </div>

            <div className="grid grid-cols-2 gap-10">
              <Field>
                <FieldLabel htmlFor="gstin">GSTIN</FieldLabel>
                <Input
                  id="gstin"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27ABCDE1234F2Z5"
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cin">CIN</FieldLabel>
                <Input
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="Corporate Identification Number"
                  autoComplete="off"
                />
              </Field>
              </div>

            <div className="grid grid-cols-2 gap-10">
              <Field>
                <FieldLabel htmlFor="fssai">FSSAI No.</FieldLabel>
                <Input
                  id="fssai"
                  name="fssai"
                  value={formData.fssai}
                  onChange={handleChange}
                  placeholder="FSSAI1234567890"
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="pan">PAN No.</FieldLabel>
                <Input
                  id="pan"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="AAAPZ1234C"
                  autoComplete="off"
                />
              </Field>
              </div>

            <div className="grid grid-cols-2 gap-10">
              <Field>
                <FieldLabel htmlFor="dlno">DL No.</FieldLabel>
                <Input
                  id="dlno"
                  name="dlno"
                  value={formData.dlno}
                  onChange={handleChange}
                  placeholder="DL1234567"
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="dlexp">DL Expiry</FieldLabel>
                <Input
                  id="dlexp"
                  name="dlexp"
                  type="date"
                  value={formData.dlexp.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dlexp: new Date(e.target.value),
                    })
                  }
                  required
                />
              </Field>
              </div>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
