/*
 * Created Date: Tu Oct 2022
 * Author: Phieule
 * File: PanigationGlobal.tsx
 * Project: roamie-react-ts
 * -----
 * Last Modified: Sun Oct 30 2022
 * Modified By: Phieule
 * -----
 * Copyright (c) 2022 Voices of Sales Consultancy
 * -----
 * HISTORY:
 * Date      	By	Comments
 * ----------	---	---------------------------------------------------------
 */

import { Box, Grid, MenuItem, Pagination, SelectChangeEvent } from "@mui/material";
import { END_POINT } from "configs";
import { MySelectField } from "control";
import { useTranslation } from "react-i18next";
import { gridSpacing } from "store/constant";

// ==============================|| Panigation ||============================== //
type IPanigation = {
	numberRowsArr: Array<number>;
	rowsPerPage: number;
	page: number;
	totalRow: number;
	handleChangePage: (val: number) => void;
	handleChangeRowsPerPage: (val: number) => void;
};
const MyPaginationGlobal: React.FC<IPanigation> = ({
	numberRowsArr,
	rowsPerPage,
	page,
	totalRow,
	handleChangePage,
	handleChangeRowsPerPage
}) => {
	const { t } = useTranslation();
	let totalPage: number = Math.ceil(totalRow / rowsPerPage);
	const handleSetPage = (e: React.ChangeEvent<unknown>, page: number) => {
		handleChangePage(page - 1);
	};
	const handlePerpageChange = (e: SelectChangeEvent<unknown>) => {
		let val: number = e && e.target && e.target.value ? parseInt(new String(e.target.value).toString()) : 0;
		handleChangeRowsPerPage(val);
	};
	return (
		<Grid container justifyContent="space-between" marginTop={2} marginBottom={2}>
			<Grid item xs={2}>
				<MySelectField value={rowsPerPage} onChange={handlePerpageChange} fullWidth size="small">
					{numberRowsArr.map((item: number, idx: number) => {
						return (
							<MenuItem key={`pagination-perpage-item-${idx}`} value={item}>
								{item}
							</MenuItem>
						);
					})}
				</MySelectField>
			</Grid>
			<Grid item xs={10}>
				<Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
					<Pagination
						count={totalPage}
						onChange={handleSetPage}
						page={page + 1}
						color="primary"
						variant="outlined"
						shape="rounded"
					/>
				</Box>
			</Grid>
		</Grid>
	);
};

export default MyPaginationGlobal;
