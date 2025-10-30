export interface PurchaseMaster {
    id: number | null;
    supplierId: number | null;
    PODate: Date;
    dueDate: Date;
    invoiceNumber: string | null;
    igst: number;
    subTotal: number;
    grandTotal: number;
  }
