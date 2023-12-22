// third-party

// assets
import React from "react";
import { FormattedMessage } from "react-intl";

interface UserMenuProps {
	id: string;
	title: React.ReactNode;
	url: string;
}

const user: UserMenuProps = {
	id: "user",
	title: <FormattedMessage id="User" />,
	url: "/admin/user/list"
};

export default user;
