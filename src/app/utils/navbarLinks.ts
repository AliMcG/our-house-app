import ShoppingImage from "@/public/shopping_icon.svg";
import ChoresImage from "@/public/chores_icon.svg";
import { Calendar, CheckSquare, Home, LucideProps, Settings, ShoppingCart, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


export type NavItemType = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | string
};

export const navbarLinks: NavItemType[] = [
  {
    name: "Shopping Lists",
    href: "/shoppingLists",
    icon: ShoppingImage as string
  },
  {
    name: "Chores",
    href: "/chores",
    icon: ChoresImage as string
  }
];

export const navigation: NavItemType[] = [
  { name: 'Dashboard', href: '/home', icon: Home },
  { name: 'Shopping Lists', href: '/shopping-lists', icon: ShoppingCart },
  { name: 'Chores', href: '/chores', icon: CheckSquare }, // TODO should this be Tasks?
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]