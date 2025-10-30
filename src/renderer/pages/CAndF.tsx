import { BoxesIcon, HourglassIcon, IndianRupeeIcon, PackageIcon, PackageMinusIcon, TimerOffIcon, TruckElectricIcon, TruckIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import AddCAndFDialog from "../components/dialogs/AddCAndFDialog";
import { CANDF } from "../types/cAndF";
import { useEffect, useState } from "react";
import CAndFCard from "../components/cards/CAndFCard";

export default function CAndF() {

    const [cAndFs, setCAndFs] = useState<CANDF[]>([])
    const handleAddCAndF = (newCAndF: CANDF) => {
      window.api.addCandF(newCAndF);
      setCAndFs([...cAndFs, newCAndF])
    }

    const handleDeleteCAndF = (id: CANDF['id']) => {
        window.api.deleteCandF(id)
        setCAndFs((prev) => prev.filter((candf) => candf.id !== id));
    }

    const handleUpdateCAndF = (updatedCAndF: CANDF) => {
        window.api.updateCandF(updatedCAndF);
        setCAndFs((prev) => prev.map((p) => p.id === updatedCAndF.id ? updatedCAndF: p))
    }

    useEffect(() => {
        const fetchCandFs = async () => {
          const data = await window.api.getCandFs() as CANDF[];
          setCAndFs(data)
        }

        fetchCandFs();
      }, [])

    return (
        <div className="flex flex-col h-full justify-around items-center">
            <header className="flex flex-col gap-20 w-full justify-around items-center h-1/3">
                <div className="flex w-full justify-around items-center">
                    <h1 className="text-5xl text-slate-700">C&F</h1>
                    <AddCAndFDialog onAdd={handleAddCAndF} />
                </div>
                <hr className="text-black w-8/10" />
                <div className="flex flex-col gap-y-5 gap-x-5">
                    <div className="flex gap-5">
                        <Badge className="text-lg px-5 py-3"><span><TruckIcon /></span>Total C&Fs: 1</Badge>
                        <Badge className="text-lg px-5 py-3"><span><BoxesIcon /></span>Average C&F Purchases: {30}</Badge>
                    </div>
                    {/* <div className="flex gap-5">
          <Badge className="text-lg px-5 py-3"><span><TimerOffIcon /></span>Expired: {30}</Badge>
          <Badge className="text-lg px-5 py-3"><span><PackageMinusIcon /></span>Low Stock: {3}</Badge>
          <Badge className="text-lg px-5 py-3">Total Value: <span><IndianRupeeIcon /></span>{30000}</Badge>
        </div> */}
                </div>
            </header>
            <main className="h-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cAndFs.map((c) => (
                        <CAndFCard onEdit={handleUpdateCAndF} onDelete={handleDeleteCAndF} key={c.id} cAndF={c} />
                    ))}
                </div>

            </main>
        </div>
    )
}