import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Card,
	Checkbox,
	Grid,
	IconButton,
	InputAdornment,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	useTheme
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataTableLoading } from "components";
import { MyTextField } from "control";
import useConfig from "hooks/useConfig";
import { debounce } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import Swal from "sweetalert2";
import MyPaginationGlobal from "ui-component/MyPaginationGlobal";
import axios from "utils/axios";
interface IUser {
	_id: string;
	sku: string;
	dateCreated: string;
	amount: number;
}
const PER_PAGE: number = 20;
const NUMBER_ROWS: number[] = [20, 40, 60, 80, 100];
const TransactionList = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { dateFormat } = useConfig();
	let mounted: boolean = true;
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(PER_PAGE);
	const [totalItem, setTotalItem] = React.useState<number>(0);
	const [search, setSearch] = React.useState<string>("");
	const [rows, setRows] = React.useState<IUser[]>([]);
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [selected, setSelected] = React.useState<string[]>([]);
	const [dateCreated, setDateCreated] = React.useState<Date | null>(null);
	const [amount, setAmount] = React.useState<string>("");
	const isSelected = (id: string) => selected.indexOf(id) !== -1;
	const loadData = (keyword: string, perpage: number, dateVal: Date | null, amount: string) => {
		let dateCreated = "";
		if (dateVal) {
			const txtYear = dateVal.getFullYear().toString();
			const txtMonth = (dateVal.getMonth() + 1).toString().padStart(2, "0");
			const txtDay = dateVal.getDate().toString().padStart(2, "0");
			dateCreated = txtYear + "-" + txtMonth + "-" + txtDay;
		}
		let realAmount = "";
		if (amount) {
			realAmount = amount.replaceAll(",", "");
		}
		axios
			.get("/transaction/list", {
				params: {
					keyword: keyword ? keyword.trim() : undefined,
					dateCreated: dateCreated ? dateCreated : undefined,
					amount: realAmount ? realAmount : undefined,
					page: page + 1,
					perpage
				}
			})
			.then((res: any) => {
				const { status, items, total } = res.data;
				if (mounted) {
					setLoading(false);
					if (status) {
						setRows(items);
						setTotalItem(total);
					}
				}
			})
			.catch((err: any) => {
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
			});
	};
	const debouncedSearch = React.useRef(
		debounce((keyword: string, dateCreated: Date | null, amount: string) => {
			mounted = true;
			loadData(keyword, rowsPerPage, dateCreated, amount);
		}, 500)
	).current;
	React.useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);
	React.useEffect(() => {
		loadData(search, rowsPerPage, dateCreated, amount);
		return () => {
			mounted = false;
		};
	}, [search, page, rowsPerPage, dateCreated, amount]);
	const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			const newSelectedId = rows.map((n) => n._id);
			setSelected(newSelectedId!);
			return;
		}
		setSelected([]);
	};
	const handleSelectedItem = (e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>, id: string) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: string[] = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	};
	const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
		let strSearch = event && event.target && event.target.value ? event.target.value.toString() : "";
		setSearch(strSearch);
		setPage(0);
		setLoading(true);
		setSelected([]);
		debouncedSearch(strSearch, dateCreated, amount);
	};
	const handleChangePage = (val: number) => {
		setPage(val);
		setLoading(true);
	};
	const handleChangeRowsPerPage = (val: number) => {
		setRowsPerPage(val);
		setPage(0);
		setLoading(true);
	};
	const convertDateTime = (dateParam: string) => {
		let dateVal = "";
		if (dateParam) {
			let dateCustom = new Date(dateParam);
			dateVal =
				dateCustom.getDate().toString().padStart(2, "0") +
				"/" +
				(dateCustom.getMonth() + 1).toString().padStart(2, "0") +
				"/" +
				dateCustom.getFullYear();
		}
		return dateVal;
	};
	const formatCurrency = (number: number) => {
		return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
			.format(number)
			.replace("$", "");
	};
	const handleDelete = (id: string) => () => {
		Swal.fire({
			icon: "warning",
			title: t("Confirmed delete").toString() + "?",
			showConfirmButton: true,
			showDenyButton: true,
			confirmButtonText: t("Argree").toString(),
			denyButtonText: t("No").toString()
		}).then(async (result: any) => {
			try {
				if (result.isConfirmed) {
					const res: any = await axios.delete(`/users/delete/${id}`, { headers: { isShowLoading: true } });
					const { status } = res.data;
					if (status) {
						dispatch(
							openSnackbar({
								open: true,
								message: t("Delete item successfully"),
								anchorOrigin: { vertical: "bottom", horizontal: "left" },
								variant: "alert",
								alert: {
									color: "success"
								},
								transition: "Fade",
								close: false
							})
						);
						loadData(search, rowsPerPage, dateCreated, amount);
					} else {
						dispatch(
							openSnackbar({
								open: true,
								message: t("Delete item failure"),
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
			} catch (err) {
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
		});
	};
	const handleDateCreatedChange = (newVal: Date | null) => {
		setDateCreated(newVal);
	};
	const dataTableLoaded = () => {
		return (
			<React.Fragment>
				{rows && rows.length > 0 ? (
					<React.Fragment>
						{rows.map((elmt: IUser, idx: number) => {
							const isItemSelected = isSelected(elmt._id);
							const labelId = `enhanced-table-checkbox-${idx}`;
							return (
								<TableRow hover key={`user-idx-${idx}`}>
									<TableCell onClick={(event) => handleSelectedItem(event, elmt._id)}>
										<Checkbox
											color="primary"
											checked={isItemSelected}
											inputProps={{
												"aria-labelledby": labelId
											}}
										/>
									</TableCell>
									<TableCell>{elmt.sku}</TableCell>
									<TableCell>{convertDateTime(elmt.dateCreated)}</TableCell>
									<TableCell>{formatCurrency(elmt.amount)}</TableCell>
									<TableCell>
										<IconButton color="inherit" onClick={() => navigate(`/admin/transaction/edit/${elmt._id}`)}>
											<EditTwoToneIcon sx={{ fontSize: "1.3rem" }} />
										</IconButton>
										<IconButton color="inherit" onClick={handleDelete(elmt._id)}>
											<DeleteOutlineIcon sx={{ fontSize: "1.3rem" }} />
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
					</React.Fragment>
				) : (
					<React.Fragment></React.Fragment>
				)}
			</React.Fragment>
		);
	};
	const handleAmountChange = (values: any, sourceInfo: any) => {
		let amountVal = "";
		if (values && values.formattedValue) {
			amountVal = values.formattedValue.toString().trim();
		}
		setAmount(amountVal);
	};
	return (
		<Card variant="outlined">
			<Box
				display="flex"
				alignItems="center"
				color={theme.palette.grey[800]}
				fontWeight={500}
				fontSize={20}
				height={60}
				borderBottom={1}
				pl={2}
				pr={2}
				borderColor={theme.palette.grey[300]}
			>
				{t("Transaction list")}
			</Box>
			<Box p={2}>
				<Grid container spacing={1}>
					<Grid item xl={4}>
						<MyTextField
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								)
							}}
							placeholder={t("Sku").toString()}
							onChange={handleSearch}
							value={search}
							size="small"
						/>
					</Grid>
					<Grid item xl={2}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								value={dateCreated}
								onChange={handleDateCreatedChange}
								renderInput={(props) => <MyTextField size="small" fullWidth {...props} />}
								inputFormat={dateFormat}
								mask="__/__/____"
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xl={2}>
						<NumberFormat
							fullWidth
							placeholder={t("Amount").toString()}
							customInput={MyTextField}
							thousandSeparator={true}
							value={amount}
							onValueChange={handleAmountChange}
							className="item-first"
							size="small"
						/>
					</Grid>
					<Grid item xs={4}>
						<Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/admin/transaction/add")}>
							{t("Add transaction")}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell width={30}>
											<Checkbox
												color="primary"
												indeterminate={selected.length > 0 && selected.length < rows.length}
												checked={rows.length > 0 && selected.length === rows.length}
												onChange={handleSelectAllClick}
												inputProps={{
													"aria-label": "select all desserts"
												}}
											/>
										</TableCell>
										<TableCell>{t("Sku")}</TableCell>
										<TableCell>{t("Date created")}</TableCell>
										<TableCell>{t("Amount")}</TableCell>
										<TableCell width={200}>{t("Action")}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<DataTableLoading isLoading={isLoading} data={dataTableLoaded()} numColumn={5} />
								</TableBody>
							</Table>
						</TableContainer>
						<MyPaginationGlobal
							numberRowsArr={NUMBER_ROWS}
							rowsPerPage={rowsPerPage}
							page={page}
							totalRow={totalItem}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
};

export default TransactionList;
