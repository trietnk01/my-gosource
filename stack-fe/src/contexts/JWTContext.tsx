// third-party
import React, { createContext, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import accountReducer from "store/accountReducer";
// reducer - state management
import { LOGIN, LOGOUT } from "store/actions";
import { openSnackbar } from "store/slices/snackbar";
import { InitialLoginContextProps, JWTContextType } from "types/auth";
// project imports
import { useMutation } from "@apollo/client";
import { checkValidTokenMutation, loginMutation, logoutMutation } from "graphql-client/mutations";
import useConfig from "hooks/useConfig";
import { store } from "store";
import { DefaultRootStateProps } from "types";
import Loader from "ui-component/Loader";
import auth_service from "utils/authService";
import axios from "utils/axios";
// constant
const initialState: InitialLoginContextProps = {
	isLoggedIn: false,
	isInitialized: false,
	user: null
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);
interface JWTProviderProps {}
const JWTProvider: React.FC<React.PropsWithChildren<JWTProviderProps>> = ({ children }) => {
	const [state, dispatch] = useReducer(accountReducer, initialState);
	const { onChangeLocale, onChangeCurrency, onChangeDateFormat } = useConfig();
	const { i18n, t } = useTranslation();
	const [loginUser] = useMutation(loginMutation);
	const [logoutUser] = useMutation(logoutMutation);
	const [checkValidTokenUser] = useMutation(checkValidTokenMutation);
	useEffect(() => {
		const init = async () => {
			const accessToken: string = auth_service.getAccessToken();
			if (accessToken) {
				const res: any = await checkValidTokenUser({ variables: { token: accessToken } });
				const { status, item } = res.data.checkValidToken;
				if (status) {
					const userItem: DefaultRootStateProps["user_profile"] | null = item;
					if (userItem) {
						const lang: string = "en";
						i18n.changeLanguage(lang);
						dispatch({
							type: LOGIN,
							payload: {
								isLoggedIn: true,
								user: userItem
							}
						});
					}
				} else {
					delete axios.defaults.headers.common.Authorization;
					auth_service.clearAccessToken();
					dispatch({ type: LOGOUT });
					store.dispatch(
						openSnackbar({
							open: true,
							message: t("Invalid token"),
							anchorOrigin: { vertical: "bottom", horizontal: "left" },
							variant: "alert",
							alert: {
								color: "error"
							},
							transition: "Fade",
							close: false
						})
					);
				}
			} else {
				delete axios.defaults.headers.common.Authorization;
				auth_service.clearAccessToken();
				dispatch({ type: LOGOUT });
			}
		};
		init();
	}, []);

	const login = async (email: string, password: string) => {
		const res: any = await loginUser({
			variables: {
				email,
				password
			}
		});
		const { status, item } = res.data.login;
		if (status) {
			let userItem: DefaultRootStateProps["user_profile"] | null = item;
			if (userItem) {
				auth_service.setAccessToken(item.token);
				const lang: string = "en";
				const currency: string = "USD";
				const dateFormat: string = "dd/MM/yyyy";
				onChangeLocale(lang);
				onChangeCurrency(currency);
				onChangeDateFormat(dateFormat);
				i18n.changeLanguage(lang);
				dispatch({
					type: LOGIN,
					payload: {
						isLoggedIn: true,
						user: userItem
					}
				});
				store.dispatch(
					openSnackbar({
						open: true,
						message: t("Login successfully"),
						anchorOrigin: { vertical: "bottom", horizontal: "left" },
						variant: "alert",
						alert: {
							color: "success"
						},
						transition: "Fade",
						close: false
					})
				);
			}
		} else {
			store.dispatch(
				openSnackbar({
					open: true,
					message: t("Login failure"),
					anchorOrigin: { vertical: "bottom", horizontal: "left" },
					variant: "alert",
					alert: {
						color: "error"
					},
					transition: "Fade",
					close: false
				})
			);
		}
	};

	const logout = async (id: string) => {
		const res: any = await logoutUser({
			variables: {
				id
			}
		});
		const { status } = res.data.logout;
		if (status) {
			delete axios.defaults.headers.common.Authorization;
			auth_service.clearAccessToken();
			dispatch({ type: LOGOUT });
		}
	};

	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	return <JWTContext.Provider value={{ ...state, login, logout }}>{children}</JWTContext.Provider>;
};
export { JWTProvider };
export default JWTContext;
