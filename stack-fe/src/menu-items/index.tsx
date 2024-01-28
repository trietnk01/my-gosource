import { DefaultRootStateProps } from "types";
import dashboard from "./dashboard";
import product from "./product";
// ==============================|| MENU ITEMS ||============================== //

const menuItems: DefaultRootStateProps["NavItemType"][] = [dashboard, product];

export { menuItems };
