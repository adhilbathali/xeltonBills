export interface InvoiceItem {
    id: number;
    productId: number;
    invoiceId?: number;
    tradePrice: number;
    qty: number;
    exp: Date;
    fqty: number;
    total: number;
    taxableValue?: number;
    disc: number;
}