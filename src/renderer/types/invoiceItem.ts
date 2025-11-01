export interface InvoiceItem {
    id: number;
    productId: number;
    invoiceId?: number;
    tradePrice: number;
    batchNo: string;
    mfg: Date;
    exp: Date;
    qty: number;
    fqty: number;
    total: number;
    taxableValue?: number;
    disc: number;
}