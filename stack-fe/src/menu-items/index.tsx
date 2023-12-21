import { DefaultRootStateProps } from "types";
import dashboard from "./dashboard";
import user from "./user";
// ==============================|| MENU ITEMS ||============================== //

const menuItems: DefaultRootStateProps["NavItemType"][] = [dashboard, user];

export { menuItems };
