import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Profile } from "@/renderer/types/profile";
import { EditIcon } from "lucide-react";

type Props = {
  onEdit: (profile: Profile) => void;
  profile: Profile;
};

export default function EditProfileDialog({ onEdit, profile }: Props) {
  const [formData, setFormData] = useState<Profile>(profile);
  const [open, setOpen] = useState(false);

  // ✅ Sync formData with latest profile whenever it changes
  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <EditIcon className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-card text-card-foreground border border-border shadow-md">
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
          <DialogDescription>
            This will reflect in your invoices header.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldSet>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="ABC Traders"
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

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
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
                    required
                  />
                </Field>
              </div>

              {/* Legal Info */}
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="gstin">GSTIN</FieldLabel>
                  <Input
                    id="gstin"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="27ABCDE1234F2Z5"
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
                  />
                </Field>
              </div>

              {/* IDs */}
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="fssai">FSSAI No.</FieldLabel>
                  <Input
                    id="fssai"
                    name="fssai"
                    value={formData.fssai}
                    onChange={handleChange}
                    placeholder="FSSAI1234567890"
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
                  />
                </Field>
              </div>

              {/* License Info */}
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="dlno">DL No.</FieldLabel>
                  <Input
                    id="dlno"
                    name="dlno"
                    value={formData.dlno}
                    onChange={handleChange}
                    placeholder="DL1234567"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="dlexp">DL Expiry</FieldLabel>
                  <Input
                    id="dlexp"
                    name="dlexp"
                    type="date"
                    value={formData.dlexp?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, dlexp: new Date(e.target.value) })
                    }
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
