import { EditIcon } from "lucide-react"
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
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { CANDF } from "@/renderer/types/cAndF"
import { useState } from "react"

type Props = {
    onEdit: (cAndF: CANDF) => void;
    cAndF: CANDF;
}

export default function EditCAndFDialog({ onEdit, cAndF }: Props){
    const [formData, setFormData] = useState<CANDF>(cAndF)
    const [open, setOpen] = useState(false)


      const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value} = e.target;
        setFormData({ ...formData, [name]: value})
      }

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        onEdit(formData);
        setOpen(false)
      }
    return(
        <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
  <Button variant="ghost" size="icon" className="hover:bg-slate-200"><span><EditIcon className="text-blue-400"/></span></Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit C&F</DialogTitle>
      <DialogDescription>
        Edit and save the C&F to the list.
      </DialogDescription>
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
                  <Input name="phone" value={formData.phone} onChange={handleChange} id="phone" type="tel" placeholder="+91 14293 21403" autoComplete="off" required />
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
                  <Button type="submit">Save</Button>
              </DialogFooter>
            </FieldSet>
          </form>
    </DialogHeader>
  </DialogContent>
</Dialog>
    )
}