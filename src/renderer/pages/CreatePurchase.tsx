import { CANDF } from "../types/cAndF";
import { useEffect, useState } from "react";
import { PurchaseItem } from "../types/purchaseItem";
import PurchaseItemsTable from "../components/tables/PurchaseItemsTable";
import { Product } from "../types/product";
import AddPurchaseItemDialog from "../components/dialogs/AddPurchaseItemDialog";
import { PurchaseMaster } from "../types/purchaseMaster";
import CreatePurchaseMasterDialog from "../components/dialogs/CreatePurchaseMasterDialog";
import PurchaseHeader from "../components/bill/PurchaseHeader";
import PurchaseFooter from "../components/bill/PurchaseFooter";
import { Button } from "../components/ui/button";



export default function CreatePurchase() {
  const [products, setProducts] = useState<Product[]>([])
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [purchaseMaster, setPurchaseMaster] = useState<PurchaseMaster>({
    id: 0,
    supplierId: 0,
    PODate: new Date(),
    dueDate: new Date(),
    invoiceNumber: "",
    igst: 0,
    subTotal: 0,
    grandTotal: 0,
  });

  const [suppliers, setSuppliers] = useState<CANDF[]>([])

  const handleAddPurchaseMaster = (purchaseMaster: PurchaseMaster) => {
    setPurchaseMaster(purchaseMaster);
  };

  const handleSavePurchase = async () => {
    try {
      const result = await window.api.addPurchaseMaster(purchaseMaster);
      console.log("Purchase master added:", result);
      const purchaseId = result.id; // ✅ will now work
      await window.api.addPurchaseItems({
        purchaseId,
        purchaseItems: purchaseItems.map(({ id, ...rest }) => rest) // omit temp IDs
      });

      setPurchaseMaster({
        id: 0,
        supplierId: 0,
        PODate: new Date(),
        dueDate: new Date(),
        invoiceNumber: "",
        igst: 0,
        subTotal: 0,
        grandTotal: 0,
      })
      setPurchaseItems([])
      alert("Purchase Saved Successfully")
    } catch (error) {
      alert("Fill the bill.")
      console.error("Error saving purchase:", error);
    }
  };




  const handleAddPurchaseItem = (purchaseItem: PurchaseItem) => {
    // Generate a temporary numeric ID (auto-increment style)
    const tempId =
      purchaseItems.length > 0
        ? Math.max(...purchaseItems.map((p) => p.id ?? 0)) + 1
        : 1;

    // Add the new item with its temp ID
    setPurchaseItems([...purchaseItems, { ...purchaseItem, id: tempId }]);
  };



  const handleUpdatePurchaseItem = (updatedPurchaseItem: PurchaseItem) => {
    setPurchaseItems((prev) =>
      prev.map((p) => p.id === updatedPurchaseItem.id ? updatedPurchaseItem : p)
    )

  }

  const handleDeletePurchaseItem = (id: number) => {
    setPurchaseItems((prev) => prev.filter((p) => p.id !== id));
  }


  useEffect(() => {

    const fetchCustomers = async () => {
      const data = await window.api.getCandFs()
      setSuppliers(data)
    }

    const fetchProducts = async () => {
      const data = await window.api.getProducts()
      setProducts(data)
    }
    fetchCustomers();
    fetchProducts();
  }, [])


  useEffect(() => {
    const subTotal = purchaseItems.reduce((sum, item) => sum + item.total, 0);
    const igst = purchaseMaster.igst || 0;
    const grandTotal = subTotal + (subTotal * igst) / 100;

    setPurchaseMaster((prev) => ({
      ...prev,
      subTotal,
      grandTotal,
    }));
  }, [purchaseItems, purchaseMaster.igst]);





  return (
    <div className="flex flex-col h-full justify-around items-center">
<header className="w-full border-b border-gray-200 bg-white p-10 flex items-center justify-between">
  <h1 className="text-3xl font-semibold text-gray-700">
    <a href="/purchases" className="text-blue-500 hover:underline">
      Purchases
    </a>
    <span className="text-gray-400 mx-2">{'>'}</span>
    <span className="text-gray-700">Create</span>
  </h1>

  <div className="flex items-center gap-4">
    <CreatePurchaseMasterDialog
      onAdd={handleAddPurchaseMaster}
      suppliers={suppliers}
    />
    <AddPurchaseItemDialog
      products={products}
      onAdd={handleAddPurchaseItem}
    />
    <Button className="font-black" onClick={handleSavePurchase}>
  Save
</Button>

  </div>
</header>
      <main className="w-full h-full p-10 flex justify-between flex-col gap-10">
        <div className="flex flex-col gap-10">
          <PurchaseHeader purchaseMaster={purchaseMaster} suppliers={suppliers} />
          <PurchaseItemsTable products={products} onDelete={handleDeletePurchaseItem} onEdit={handleUpdatePurchaseItem} purchaseItems={purchaseItems} />
        </div>
        <PurchaseFooter purchaseMaster={purchaseMaster}/>
      </main>
    </div>
  )
}