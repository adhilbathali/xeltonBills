export interface PurchaseItem {
    id: number;
    productId: number;
    purchaseId?: number;
    purchaseRate: number;
    qty: number;
    fqty: number;
    total: number;
    disc: number;
}