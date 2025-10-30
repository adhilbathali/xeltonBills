import InvoicesTab from "../components/invoicesTab";
import RevenueTab from "../components/revenueTab";

// src/pages/Home.tsx
export default function Home() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",   // "Thursday"
    year: "numeric",   // "2023"
    month: "long",     // "November"
    day: "numeric"     // "23"
    });

    return <div className="flex h-full flex-col justify-around items-center">
        <header className="flex flex-col gap-3">
            <h1 className="text-6xl text-slate-700">Welcome, Xelton Pharma!</h1>
            <h3 className="text-slate-500 text-lg">{formattedDate}</h3>
        </header>
        {/* <div className="flex gap-10">
            <InvoicesTab/>
            <RevenueTab/>
        </div> */}
    </div>
  }
