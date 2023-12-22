import { DefaultRootStateProps } from "types";
import dashboard from "./dashboard";
import user from "./user";
import transaction from "./transaction";
// ==============================|| MENU ITEMS ||============================== //

const menuItems: DefaultRootStateProps["NavItemType"][] = [dashboard, user, transaction];

export { menuItems };
