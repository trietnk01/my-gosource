// third-party

// assets
import React from "react";
import { FormattedMessage } from "react-intl";

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

interface StudentMenuProps {
	id: string;
	title: React.ReactNode;
	url: string;
}

const dashboard: StudentMenuProps = {
	id: "student",
	title: <FormattedMessage id="Student" />,
	url: "/admin/student/list"
};

export default dashboard;
