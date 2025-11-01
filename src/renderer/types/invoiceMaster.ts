export interface InvoiceMaster {
    id: number;
    customerId: number;
    dueDate: Date;
    invoiceDate: Date;
    invoiceNumber: string;
    taxableValue: number;
    billAmount: number;
}