import {
  IndianRupeeIcon,
  PackageMinusIcon,
  TimerOffIcon,
  HourglassIcon,
  PackageIcon,
  BoxesIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import AddProductDialog from "../components/dialogs/AddProductDialog";
import ProductsTable from "../components/tables/productsTable";
import { Product } from "../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleAddProduct = (newProduct: Product) => {
    window.api.addProduct(newProduct);
    setProducts([...products, newProduct]);
  };

  const handleDelete = async (id: number) => {
    try {
      await window.api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("This product is used in a bill and cannot be deleted.");
    }
  };


  const handleUpdateProduct = (updatedProduct: Product) => {
    window.api.updateProduct(updatedProduct);
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const data = (await window.api.getProducts()) as Product[];
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // === Dummy values for summary (can later compute dynamically) ===
  const totalProducts = products.length;

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6">
      {/* ===== Header ===== */}
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-tight">
          Products
        </h1>
        <AddProductDialog onAdd={handleAddProduct} />
      </header>

      {/* ===== Stats Section ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <PackageIcon className="w-4 h-4 text-blue-500" /> Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">
              {totalProducts}
            </p>
          </CardContent>
        </Card>

        {/* <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <BoxesIcon className="w-4 h-4 text-green-500" /> Total Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">
              {totalStocks}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <HourglassIcon className="w-4 h-4 text-yellow-500" /> Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">
              {expiringSoon}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <TimerOffIcon className="w-4 h-4 text-red-500" /> Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">{expired}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <PackageMinusIcon className="w-4 h-4 text-orange-500" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">{lowStock}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-slate-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <IndianRupeeIcon className="w-4 h-4 text-emerald-600" /> Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-800">
              ₹{totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card> */}
      </section>

      {/* ===== Products Table ===== */}
      <main className="flex-1 mt-4">
        {products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-60 text-slate-500">
            <p className="text-lg">No products found.</p>
            <Button className="mt-3" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <ProductsTable
              onDelete={handleDelete}
              onEdit={handleUpdateProduct}
              products={products}
            />
          </div>
        )}
      </main>
    </div>
  );
}
