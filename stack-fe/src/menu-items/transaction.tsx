// third-party

// assets
import React from "react";
import { FormattedMessage } from "react-intl";

interface TransactionProps {
	id: string;
	title: React.ReactNode;
	url: string;
}

const transaction: TransactionProps = {
	id: "transaction",
	title: <FormattedMessage id="Transaction" />,
	url: "/admin/transaction/list"
};

export default transaction;
