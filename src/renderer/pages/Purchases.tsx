import { IndianRupeeIcon, PackageMinusIcon, TimerOffIcon, HourglassIcon, PackageIcon, BoxesIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export default function Purchases() {
    return <div className="flex flex-col h-full justify-around items-center">
        <header className="flex flex-col gap-20 w-full justify-around items-center h-1/3">
            <div className="flex w-full justify-around items-center">
                <h1 className="text-5xl text-slate-700">Purchases</h1>
                <a href="/create-purchase"><Button className="font-black">+ Create Purchase</Button></a>
            </div>
            <hr className="text-black w-8/10" />
            <div className="flex flex-col gap-y-5 gap-x-5">
                <div className="flex gap-5">
                    <Badge className="text-lg px-5 py-3"><span><PackageIcon /></span>Total Purchase Orders: {4}</Badge>
                    <Badge className="text-lg px-5 py-3"><span><HourglassIcon /></span>Expiring Soon: {30}</Badge>
                </div>
                <div className="flex gap-5">
                    <Badge className="text-lg px-5 py-3"><span><TimerOffIcon /></span>Expired: {30}</Badge>
                    <Badge className="text-lg px-5 py-3"><span><PackageMinusIcon /></span>Low Stock: {3}</Badge>
                    <Badge className="text-lg px-5 py-3">Total Purchase Value: <span><IndianRupeeIcon /></span>{30000}</Badge>
                </div>
            </div>
        </header>
        <main className="h-1/2">
        </main>
    </div>
}
