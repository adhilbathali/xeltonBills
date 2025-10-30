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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../ui/field"

import { Input } from "../ui/input"

import { Textarea } from "../ui/textarea"
import { CANDF } from "@/renderer/types/cAndF"

type Props = {
  onAdd: (candf: CANDF) => void;
}


export default function AddCAndFDialog({ onAdd }: Props) {
  const [formData, setFormData] = useState<CANDF>({
    id: null,
    companyName: "",
    companyAddress: "",
    email:"",
    phone:"",
    gstin: "",
    pan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onAdd(formData);
    setFormData({
      id: null,
      companyName: "",
      companyAddress: "",
      email:"",
      phone:"",
      gstin: "",
      pan: "",
    })
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild><Button>+ Add C&F</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add C&F</DialogTitle>
            <DialogDescription>
              Add carry and forwarders to the list of c&fs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Company Name</FieldLabel>
                  <Input name="companyName" value={formData.companyName} onChange={handleChange} id="name" autoComplete="off" placeholder="abc corp" required />
                  <FieldDescription>The registered Company name.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Company Address</FieldLabel>
                  <Textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} id="address" placeholder="abc nagar 21 street." required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input name="email" value={formData.email} onChange={handleChange} id="email" type="email" placeholder="xelton@gmail.com" autoComplete="off" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input name="phone" value={formData.phone} onChange={handleChange} id="phone" type="number" placeholder="+91 14293 21403" autoComplete="off" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gst">GSTIN No.</FieldLabel>
                  <Input name="gstin" value={formData.gstin} onChange={handleChange} id="gst" placeholder="27ABCDE1234F2Z5" autoComplete="off" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pan">PAN No.</FieldLabel>
                  <Input name="pan" value={formData.pan} onChange={handleChange} id="pan" placeholder="AAAPZ1234C" autoComplete="off" required />
                </Field>
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
    </>
  )
}