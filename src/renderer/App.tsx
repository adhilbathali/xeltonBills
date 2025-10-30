import { Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import Home from "./pages/Home"
import Invoices from "./pages/Invoices"
import Products from "./pages/Products"
import Customers from "./pages/Customers"
import Profile from "./pages/Profile"
import Purchases from "./pages/Purchases"
import CreatePurchase from "./pages/CreatePurchase"
import CAndF from "./pages/CAndF"
import CreateInvoice from "./pages/CreateInvoice"
import ViewInvoice from "./pages/ViewInvoices"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/purchases" element={<Purchases/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/c&f" element={<CAndF />} />
        <Route path="/create-purchase" element={<CreatePurchase />} />
        <Route path="/view-invoice/:id" element={<ViewInvoice />} />
      </Routes>
    </Layout>
  )
}

export default App
