import { Home, Settings, PencilIcon, PillBottleIcon, LucideUserStar, UserCircle, CreditCardIcon, ShoppingBagIcon, ShoppingCart, TruckIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/renderer/components/ui/sidebar"

// Menu items.
const items = [
  // {
  //   title: "Home",
  //   url: "/",
  //   icon: Home,
  // },
  // {
  //   title: "Purchases",
  //   url: "purchases",
  //   icon: ShoppingCart,
  // },
  {
    title: "Invoices",
    url: "/invoices",
    icon: PencilIcon,
  },
  {
    title: "Products",
    url: "/products",
    icon: PillBottleIcon,
  },
  // {
  //   title: "Suppliers",
  //   url: "c&f",
  //   icon: TruckIcon,
  // },
  {
    title: "Customers",
    url: "customers",
    icon: LucideUserStar,
  },
  {
    title: "Profile",
    url: "profile",
    icon: UserCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]">
          <SidebarGroupLabel className="p-10"><h1 className="text-2xl font-bold text-blue-500">Xelton Bills</h1></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="py-5">
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}