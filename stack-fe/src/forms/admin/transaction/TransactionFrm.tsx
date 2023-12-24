import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Card, Grid, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MyTextField } from "control";
import { MyLabelField } from "control/MyLabelField";
import useConfig from "hooks/useConfig";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { DefaultRootStateProps } from "types";
import axios from "utils/axios";
import * as yup from "yup";
import NumberFormat from "react-number-format";
interface IFormInput {
	sku: string;
	dateCreated: Date | null;
	amount: string;
}
interface ITransaction {
	sku: string;
	dateCreated: string;
	amount: string;
}
const TransactionFrm = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { t } = useTranslation();
	let mounted: boolean = true;
	const { id } = useParams();
	const [base64Url, setBase64Url] = React.useState<string>("");
	const [avatar, setAvatar] = React.useState<DefaultRootStateProps["MediaSource"] | null>(null);
	const [removedAvatar, setRemovedAvatar] = React.useState<boolean>(false);
	const { dateFormat } = useConfig();
	const schema = yup
		.object({
			sku: yup.string().required(t("Field required").toString()),
			amount: yup.string().required(t("Field required").toString())
		})
		.required();
	const {
		handleSubmit,
		control,
		setValue,
		setError,
		getValues,
		formState: { errors }
	} = useForm<IFormInput>({
		defaultValues: {
			sku: "",
			dateCreated: null,
			amount: ""
		},
		resolver: yupResolver(schema)
	});
	const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
		try {
			let checked: boolean = true;
			let action: string = id ? "UPDATE" : "CREATE";
			if (checked) {
				let dateCreated = "";
				if (dataForm.dateCreated) {
					dateCreated = `${dataForm.dateCreated.getFullYear()}-${(dataForm.dateCreated.getMonth() + 1)
						.toString()
						.padStart(2, "0")}-${dataForm.dateCreated.getDate().toString().padStart(2, "0")}`;
				}
				let frmData: any = new FormData();
				frmData.append("sku", dataForm.sku.toString().trim());
				frmData.append("dateCreated", dateCreated.toString().trim());
				frmData.append("amount", dataForm.amount ? parseInt(dataForm.amount.toString().replaceAll(",", "")) : 0);
				let res: any = null;
				switch (action) {
					case "CREATE":
						res = await axios.post("/transaction/create", frmData, {
							headers: { isShowLoading: true, ContentType: "multipart/form-data" }
						});
						break;
					case "UPDATE":
						if (id) {
							res = await axios.patch(`/transaction/update/${id.toString()}`, frmData, {
								headers: { isShowLoading: true, ContentType: "multipart/form-data" }
							});
						}
						break;
				}
				const { status, insertId } = res.data;
				if (status) {
					if (action === "CREATE") {
						navigate(`/admin/transaction/edit/${insertId}`);
					}
					dispatch(
						openSnackbar({
							open: true,
							message: action === "CREATE" ? t("Create transaction successfully") : t("Update transaction successfully"),
							anchorOrigin: { vertical: "bottom", horizontal: "left" },
							variant: "alert",
							alert: {
								color: "success"
							},
							transition: "Fade",
							close: false
						})
					);
				} else {
					dispatch(
						openSnackbar({
							open: true,
							message: t("Save transaction failure"),
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
			}
		} catch (err: any) {
			dispatch(
				openSnackbar({
					open: true,
					message: t("Error system"),
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
	React.useEffect(() => {
		const init = async () => {
			try {
				let sku: string = "";
				let dateCreated: Date | null = null;
				let amount: string = "";
				if (id) {
					const res: any = await axios.get(`/transaction/show/${id.toString()}`, { headers: { isShowLoading: true } });
					const { status, item } = res.data;
					if (status) {
						const transactionElmt: ITransaction = item ? item : null;
						if (transactionElmt) {
							sku = transactionElmt.sku;
							dateCreated = new Date(transactionElmt.dateCreated);
							amount = transactionElmt.amount;
						}
					} else {
						dispatch(
							openSnackbar({
								open: true,
								message: t("Transaction detail shown failure"),
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
				}
				if (mounted) {
					setValue("sku", sku);
					setValue("dateCreated", dateCreated);
					setValue("amount", amount);
				}
			} catch (err: any) {
				dispatch(
					openSnackbar({
						open: true,
						message: t("Error system"),
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
		init();
		return () => {
			mounted = false;
		};
	}, [id]);
	const handleDateCreated = (val: Date | null) => {
		setValue("dateCreated", val);
	};
	const handleAmountChange = (values: any, sourceInfo: any) => {
		let amountVal = "";
		if (values && values.formattedValue) {
			amountVal = values.formattedValue.toString().trim();
		}
		setValue("amount", amountVal);
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Card variant="outlined">
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					height={60}
					pl={2}
					pr={2}
					borderBottom={1}
					borderColor={theme.palette.grey[300]}
				>
					<Box color={theme.palette.grey[800]} fontWeight={500} fontSize={20}>
						{t("Transaction information")}
					</Box>
					<Box display="flex" columnGap={2}>
						<Button
							variant="contained"
							startIcon={<KeyboardBackspaceOutlinedIcon />}
							onClick={() => navigate("/admin/transaction/list")}
						>
							{t("Back")}
						</Button>
						<Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/admin/transaction/add")}>
							{t("Add transaction")}
						</Button>
					</Box>
				</Box>
				<Box p={2}>
					<Grid container spacing={2}>
						<Grid item lg={12}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Card variant="outlined" sx={{ p: 2 }}>
									<Grid container spacing={2}>
										<Grid item lg={4}>
											<Box display="flex" flexDirection="column">
												<Box display="flex" alignItems="center" columnGap={1}>
													<MyLabelField>{t("Sku")}</MyLabelField>
													<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
												</Box>
												<Controller
													name="sku"
													defaultValue=""
													control={control}
													render={({ field }) => {
														return (
															<Box display="flex" flexDirection="column" rowGap={1}>
																<MyTextField {...field} size="small" type="text" fullWidth />
																{errors.sku && (
																	<Box color={theme.palette.error.main}>{errors.sku.message}</Box>
																)}
															</Box>
														);
													}}
												/>
											</Box>
										</Grid>
										<Grid item lg={4}>
											<Box display="flex" flexDirection="column">
												<Box display="flex" alignItems="center" columnGap={1}>
													<MyLabelField>{t("Display name")}</MyLabelField>
													<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
												</Box>
												<Controller
													name="dateCreated"
													control={control}
													render={({ field }) => (
														<DatePicker
															inputFormat={dateFormat}
															label={t("Date created")}
															renderInput={(params) => <MyTextField size="small" fullWidth {...params} />}
															{...field}
															onChange={handleDateCreated}
														/>
													)}
												/>
											</Box>
										</Grid>
										<Grid item lg={4}>
											<Box display="flex" flexDirection="column">
												<Box display="flex" alignItems="center" columnGap={1}>
													<MyLabelField>{t("Amount")}</MyLabelField>
													<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
												</Box>
												<Controller
													name="amount"
													defaultValue=""
													control={control}
													render={({ field }) => {
														return (
															<Box display="flex" flexDirection="column" rowGap={1}>
																<NumberFormat
																	fullWidth
																	placeholder={t("Amount").toString()}
																	customInput={MyTextField}
																	thousandSeparator={true}
																	onValueChange={handleAmountChange}
																	className="item-first"
																	size="small"
																	{...field}
																/>

																{errors.amount && (
																	<Box color={theme.palette.error.main}>{errors.amount.message}</Box>
																)}
															</Box>
														);
													}}
												/>
											</Box>
										</Grid>
										<Grid item lg={12} display="flex" justifyContent="flex-end">
											<Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>
												{t("Update")}
											</Button>
										</Grid>
									</Grid>
								</Card>
							</form>
						</Grid>
					</Grid>
				</Box>
			</Card>
		</LocalizationProvider>
	);
};

export default TransactionFrm;
