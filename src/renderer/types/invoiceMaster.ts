export interface InvoiceMaster {
    id: number;
    customerId: number;
    dueDate: Date;
    invoiceDate: Date;
    invoiceNumber: string;
    igst: number;
    subTotal: number;
    grandTotal: number;
}