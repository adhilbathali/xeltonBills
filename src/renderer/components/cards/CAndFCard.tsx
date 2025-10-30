import { CANDF } from "../../types/cAndF";
import { Mail, Phone, MapPin, FileText, Building2, Trash2Icon, Edit2Icon, EditIcon } from "lucide-react";
import { Button } from "../ui/button";
import EditCAndFDialog from "../dialogs/EditCAndFDialog";

type Props = {
  onDelete: (id: CANDF["id"]) => void;
  onEdit: (cAndF: CANDF) => void;
  cAndF: CANDF;
};

export default function CAndFCard({ cAndF, onDelete, onEdit }: Props) {
  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-4">
      {/* actions */}
      <div className="flex items-center justify-end">
        <Button variant="ghost" size="icon" className="hover:bg-slate-200" onClick={() => onDelete(cAndF.id)}><span><Trash2Icon className="text-red-400"/></span></Button>
        <EditCAndFDialog onEdit={onEdit} cAndF={cAndF}/>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{cAndF.companyName}</h2>
            <p className="text-sm text-muted-foreground">ID: {cAndF.id}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary w-4 h-4" />
          <span>{cAndF.companyAddress}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="text-primary w-4 h-4" />
          <span>{cAndF.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="text-primary w-4 h-4" />
          <span>{cAndF.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="text-primary w-4 h-4" />
          <span>GSTIN: {cAndF.gstin}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="text-primary w-4 h-4" />
          <span>PAN: {cAndF.pan}</span>
        </div>
      </div>
    </div>
  );
}
