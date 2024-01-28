import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import {
	Avatar,
	Box,
	Button,
	Card,
	Checkbox,
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
import { MyTextField } from "control";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "store";
import axios from "utils/axios";
import { openSnackbar } from "store/slices/snackbar";
import { DataTableLoading } from "components";
import NoAvatar from "assets/images/no-avatar.jpg";
import Swal from "sweetalert2";
import { END_POINT } from "configs";
import { debounce } from "lodash";
import { useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
interface IProduct {
	id: number;
	title: string;
	price: number;
	thumbnail: string;
}
const ProductList = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	let mounted: boolean = true;
	const [search, setSearch] = React.useState<string>("");
	const [rows, setRows] = React.useState<IProduct[]>([]);
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [selected, setSelected] = React.useState<number[]>([]);
	const isSelected = (id: number) => selected.indexOf(id) !== -1;
	const tbProductRef = React.useRef<HTMLDivElement | null>(null);
	const [limit, setLimit] = React.useState<number>(20);
	const [skip, setSkip] = React.useState<number>(0);
	const [isShowProgress, setIsShowProgress] = React.useState<boolean>(false);
	const tbProductHeight = 900;
	const scrollTop = 560;
	const getList = async (keyword: string, limit: number, skip: number) => {
		let url = "";
		if (keyword) {
			url = `/products/search`;
		} else {
			url = `/products`;
		}
		const res = await axios.get(url, {
			params: {
				q: keyword ? keyword : undefined,
				limit,
				skip
			}
		});
		if (mounted) {
			const { products } = res.data;
			setLoading(false);
			let items: IProduct[] = products && products.length > 0 ? products : [];
			setRows(items);
		}
	};
	React.useEffect(() => {
		getList(search, limit, skip);
		if (skip > 0 && limit > 20) {
			setTimeout(() => {
				setIsShowProgress(false);
				if (tbProductRef.current) {
					tbProductRef.current.scrollTo({
						top: 100,
						left: 0,
						behavior: "smooth"
					});
				}
			}, 1000);
		}
		return () => {
			mounted = false;
		};
	}, [search, limit, skip]);
	React.useEffect(() => {
		let y = 0;
		if (tbProductRef.current) {
			tbProductRef.current.scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth"
			});
			tbProductRef.current.onscroll = () => {
				y = tbProductRef.current ? parseInt(tbProductRef.current.scrollTop.toString()) : 0;
				if (y === scrollTop) {
					setSkip((prevSkip) => prevSkip + 1);
					setLimit((prevLimit) => prevLimit + 20);
					setIsShowProgress(true);
				}
			};
		}
		return () => {
			mounted = false;
		};
	}, []);
	const dataTableLoaded = () => {
		return (
			<React.Fragment>
				{rows && rows.length > 0 ? (
					<React.Fragment>
						{rows.map((elmt: IProduct, idx: number) => {
							return (
								<TableRow hover key={`product-idx-${idx}`}>
									<TableCell width={800}>{elmt.title}</TableCell>
									<TableCell width={500}>{elmt.price}</TableCell>
									<TableCell>
										<Avatar src={elmt.thumbnail} />
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
	const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
		let strSearch = event && event.target && event.target.value ? event.target.value.toString() : "";
		setSearch(strSearch);
		setSkip(0);
		setLimit(20);
		setLoading(true);
		debouncedSearch(strSearch, 20, 0);
	};
	const debouncedSearch = React.useRef(
		debounce((strSearch: string, limit: number, skip: number) => {
			mounted = true;
			getList(strSearch, limit, skip);
		}, 500)
	).current;
	React.useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);
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
				{"Product list"}
			</Box>
			<Box p={2} display="flex" justifyContent="space-between" alignItems="center" height={60}>
				<Box>
					<MyTextField
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							)
						}}
						onChange={handleSearch}
						value={search}
						size="small"
					/>
				</Box>
			</Box>
			<Box sx={{ position: "relative" }}>
				<Box>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell width={800}>{t("Name")}</TableCell>
								<TableCell width={500}>{t("Price")}</TableCell>
								<TableCell>{t("Image")}</TableCell>
							</TableRow>
						</TableHead>
					</Table>
				</Box>
				<Box sx={{ height: `${tbProductHeight}px`, overflowX: "hidden" }} ref={tbProductRef}>
					<TableContainer>
						<Table>
							<TableBody>
								<DataTableLoading isLoading={isLoading} data={dataTableLoaded()} numColumn={3} />
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				{isShowProgress && (
					<Box
						sx={{
							position: "absolute",
							bottom: 0,
							left: 0,
							width: "100%",
							height: 40,
							display: "flex",
							justifyContent: "center"
						}}
					>
						<CircularProgress />
					</Box>
				)}
			</Box>
		</Card>
	);
};

export default ProductList;
