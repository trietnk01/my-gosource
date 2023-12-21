import React from "react";
// material-ui
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Box, CssBaseline, Menu, MenuItem } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { END_POINT } from "configs";
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "store";
import { toggleDrawer } from "store/slices/drawer";
import Sidebar from "./Sidebar";
interface IUser {
	_id: string;
	displayName: string;
	email: string;
	phone: string;
	avatar: string;
}
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	})
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-end"
}));
const menuId = "primary-search-account-menu";
const MainLayout = () => {
	const { t } = useTranslation();
	const { logout } = useAuth();
	const dispatch = useDispatch();
	const { user } = useAuth();
	let mounted: boolean = true;
	const { isOpenDrawer } = useSelector((state) => state.drawer);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);
	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleToggleDrawer = () => {
		dispatch(toggleDrawer());
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleLogout = () => {
		logout(user && user._id ? user._id : "");
	};
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuClose}>{t("My account")}</MenuItem>
			<MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
		</Menu>
	);
	return (
		<Box display="flex">
			<CssBaseline />
			<AppBar position="fixed" open={isOpenDrawer}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleToggleDrawer}
						edge="start"
						sx={{ mr: 2, ...(isOpenDrawer && { display: "none" }) }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
						MUI
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
						<Box>{user && user.displayName ? user.displayName : ""}</Box>
						<Box sx={{ ml: 2 }}>{user && user.email ? user.email : ""}</Box>
						<IconButton
							size="large"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							<Avatar src={`${END_POINT.URL_SERVER}/images/${user?.avatar}`} />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			<Sidebar />
			{renderMenu}
			<Main open={isOpenDrawer} sx={{ p: 1 }}>
				<DrawerHeader />
				<Box sx={{ backgroundColor: "#f6fbff" }} borderRadius={2} p={2}>
					<Outlet />
				</Box>
			</Main>
		</Box>
	);
};

export default MainLayout;
