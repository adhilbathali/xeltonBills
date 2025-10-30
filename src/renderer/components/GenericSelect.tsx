import { useState } from "react"
import { CANDF } from "../types/cAndF"
import { Customer } from "../types/customer"
import { Product } from "../types/product"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

type Option = Customer | CANDF | Product

type Props = {
  id?: string,
  selectType: string,
  options: Option[],
  onSelect: (option: Option) => void,
}

export default function GenericSelect({ selectType, options, onSelect, id }: Props){


  let label: keyof Customer | keyof CANDF | keyof Product;
  if (selectType === "customers" || selectType === "suppliers") {
    label = "companyName";
  } else if (selectType === "products") {
    label = "productCD"
  } else {
    label = "id"
  }

  const handleChange = (value: string) => {
    const selectedOption = options.find((o) => o.id.toString() === value)
    onSelect(selectedOption)
  }



  return(
    <Select onValueChange={handleChange}>
      <SelectTrigger id={id} className="w-[180px]">
        <SelectValue placeholder={selectType.toLocaleUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id.toString()}>{String((o as any)[label])}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}