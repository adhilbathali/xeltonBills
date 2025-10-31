import { Customer } from "../../types/customer"
import { Mail, Phone, MapPin, FileText, Building2, IdCard, Calendar, Landmark, Trash2Icon, EditIcon } from "lucide-react"
import { Button } from "../ui/button"
import EditCustomerDialog from "../dialogs/EditCustomerDialog";

type Props = {
  onEdit: (customer: Customer) => void;
  onDelete: (id: Customer['id']) => void;
  customer: Customer;
}

export default function CustomerCard({ onEdit, onDelete, customer }: Props) {
  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-4">
      {/* actions */}
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="icon" className="hover:bg-slate-200" onClick={() => onDelete(customer.id)}><span><Trash2Icon className="text-red-400"/></span></Button>
          <EditCustomerDialog onEdit={onEdit} customer={customer}/>
        </div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{customer.companyName}</h2>
            <p className="text-sm text-muted-foreground">ID: {customer.id ?? "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary w-4 h-4" />
          <span>{customer.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="text-primary w-4 h-4" />
          <span>{customer.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="text-primary w-4 h-4" />
          <span>{customer.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="text-primary w-4 h-4" />
          <span>GSTIN: {customer.gstin || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="text-primary w-4 h-4" />
          <span>CIN: {customer.cin || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Landmark className="text-primary w-4 h-4" />
          <span>FSSAI: {customer.fssai || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          <IdCard className="text-primary w-4 h-4" />
          <span>PAN: {customer.pan || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          <IdCard className="text-primary w-4 h-4" />
          <span>DL No: {customer.dlno || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-primary w-4 h-4" />
          <span>DL Expiry: {customer.dlexp ? new Date(customer.dlexp).toLocaleDateString("en-GB") : "—"}</span>
        </div>
      </div>
    </div>
  )
}
