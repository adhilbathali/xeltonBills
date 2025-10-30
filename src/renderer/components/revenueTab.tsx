import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { IndianRupee } from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./ui/card"


export default function revenueTab(){
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    return(
        <Tabs defaultValue="today" className="w-[400px]">
  <TabsList className="bg-blue-100">
    <TabsTrigger className="text-slate-700" value="today">Today</TabsTrigger>
    <TabsTrigger className="text-slate-700" value="thisMonth">This Month</TabsTrigger>
  </TabsList>
  <TabsContent value="today">
    <Card className="bg-primary text-secondary">
        <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription><p className="text-gray-300">{`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`}</p></CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
        <CardContent className="flex justify-center items-center">
            <IndianRupee size={40}/>
            <h1 className="text-5xl font-bold">23,000</h1>
        </CardContent>
        <CardFooter>
            <p>10% more than yesterday</p>
        </CardFooter>
    </Card>
  </TabsContent>
  <TabsContent value="thisMonth">
    <Card className="bg-primary text-secondary">
        <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription><p className="text-gray-300">{`${months[now.getMonth()]} ${now.getFullYear()}`}</p></CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
        <CardContent className="flex justify-center items-center">
            <IndianRupee size={40}/>
            <h1 className="text-5xl font-bold">20,000</h1>
        </CardContent>
        <CardFooter>
            <p>15% less than last month</p>
        </CardFooter>
    </Card>
  </TabsContent>
</Tabs>
    )
}