// third-party

// assets
import React from "react";
import { FormattedMessage } from "react-intl";

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

interface ProductMenuProps {
	id: string;
	title: React.ReactNode;
	url: string;
}

const product: ProductMenuProps = {
	id: "Product",
	title: <FormattedMessage id="Product" />,
	url: "/admin/product/list"
};

export default product;
