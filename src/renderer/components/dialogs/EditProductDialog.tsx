import { EditIcon, IndianRupeeIcon } from "lucide-react"
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useEffect, useState } from "react"
import { Product } from "@/renderer/types/product"

type Props = {
    onEdit: (product: Product) => void;
    product: Product;
}


export default function EditProductDialog({ onEdit, product }: Props) {

    const [formData, setFormData] = useState<Product>(product);
    const [open, setOpen] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(formData);
        setOpen(false);
    }

    useEffect(() => {
        setFormData(product);
    }, [product]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="hover:bg-slate-200"><EditIcon className="text-blue-400" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>
                    <DialogDescription>
                        Edit and save product to the list of products.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldSet>
                        <FieldGroup>
                            {/* Product Code & Description */}
                            <Field>
                                <FieldLabel htmlFor="productCD">Product code & Description</FieldLabel>
                                <Input required
                                    id="productCD"
                                    name="productCD"
                                    type="text"
                                    placeholder="eye drops 102"
                                    value={formData.productCD}
                                    onChange={handleChange}
                                />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                {/* HSN */}
                                <Field>
                                    <FieldLabel htmlFor="hsn">HSN</FieldLabel>
                                    <Input required
                                        id="hsn"
                                        name="hsn"
                                        autoComplete="off"
                                        placeholder="HSN3004"
                                        value={formData.hsn}
                                        onChange={handleChange}
                                    />
                                </Field>

                                {/* UOM */}
                                <Field>
                                    <FieldLabel htmlFor="uom">UOM</FieldLabel>
                                    <Select
                                        onValueChange={(value: Product['uom']) =>
                                            setFormData({ ...formData, uom: value })
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={formData.uom || "Select"} />
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

                                {/* MRP */}
                                <Field>
                                    <FieldLabel htmlFor="mrp">
                                        <span className="flex justify-center items-center">
                                            MRP (<IndianRupeeIcon size={15} />)
                                        </span>
                                    </FieldLabel>
                                    <Input required
                                        id="mrp"
                                        name="mrp"
                                        type="number"
                                        autoComplete="off"
                                        placeholder="890"
                                        value={formData.mrp ?? ""}
                                        onChange={handleChange}
                                    />
                                </Field>

                                {/* GST */}
                                <Field>
                                    <FieldLabel htmlFor="gst">GST (%)</FieldLabel>
                                    <Input required
                                        id="gst"
                                        name="gst"
                                        type="number"
                                        autoComplete="off"
                                        placeholder="5"
                                        value={formData.gst ?? ""}
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
                                    <Input required
                                        id="ptr"
                                        name="ptr"
                                        type="number"
                                        autoComplete="off"
                                        placeholder="price to retail"
                                        value={formData.ptr ?? ""}
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
                                    <Input required
                                        id="pts"
                                        name="pts"
                                        type="number"
                                        autoComplete="off"
                                        placeholder="price to stockiest"
                                        value={formData.pts ?? ""}
                                        onChange={handleChange}
                                    />
                                </Field>
                            </div>
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