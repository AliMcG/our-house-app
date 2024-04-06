import ShoppingImage from "@/public/shopping_icon.svg";
import ChoresImage from "@/public/chores_icon.svg";


type NavItemType = {
  name: string;
  link: string;
  icon: string;
};

export const navbarLinks: NavItemType[] = [
  {
    name: "Shopping Lists",
    link: "/shoppingLists",
    icon: ShoppingImage as string
  },
  {
    name: "Chores",
    link: "/chores",
    icon: ChoresImage as string
  }
];