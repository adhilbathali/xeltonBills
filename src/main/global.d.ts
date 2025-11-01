import { Product } from "./product";
import { Customer } from "./customer";
import { CANDF } from "./cAndF";
import { PurchaseMaster } from "./purchaseMaster";
import { PurchaseItem } from "./purchaseItem";
import { InvoiceMaster } from "./invoiceMaster";
import { InvoiceItem } from "./invoiceItem";

declare global {
  interface Window {
    api: {
      // PRODUCTS
      getProducts: () => Promise<Product[]>;
      addProduct: (product: Product) => Promise<Product>;
      updateProduct: (product: Product) => Promise<Product>;
      deleteProduct: (id: number) => Promise<number>;

      // CUSTOMERS
      getCustomers: () => Promise<Customer[]>;
      addCustomer: (customer: Customer) => Promise<Customer>;
      updateCustomer: (customer: Customer) => Promise<Customer>;
      deleteCustomer: (id: number) => Promise<number>;

      // INVOICE MASTER
      getInvoiceMasters: () => Promise<InvoiceMaster[]>;
      addInvoiceMaster: (
        invoiceMaster: InvoiceMaster
      ) => Promise<{ id: number }>;
      deleteInvoiceMaster: (
        id: number
      ) => Promise<{ success: boolean; message?: string }>;
      getInvoiceMasterById: (id: number) => Promise<InvoiceMaster | undefined>;

      // INVOICE ITEMS
      addInvoiceItems: (args: {
        invoiceId: number;
        invoiceItems: InvoiceItem[];
      }) => Promise<{ success: boolean }>;
      getInvoiceItemsByInvoiceId: (
        invoiceId: number
      ) => Promise<InvoiceItem[]>;
      getInvoiceItems: () => Promise<InvoiceItem[]>;

     // INVOICE PRINT
printInvoice: (invoiceNumber: string) => Promise<string>;

// PROFILE
getProfile: () => Promise<Profile | null>;
saveProfile: (profile: Profile) => Promise<void>;
    };

  }
}

export {};
