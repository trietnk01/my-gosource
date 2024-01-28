import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MyTextField } from "control";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import React from "react";

interface IFormInput {
	sentence: string;
}
interface IData {
	label: string;
	count: number;
}
const Excercise = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [data, setData] = React.useState<IData[]>([]);
	const schema = yup
		.object({
			sentence: yup.string().required("Field required")
		})
		.required();
	const {
		register,
		handleSubmit,
		control,
		getValues,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: { errors }
	} = useForm<IFormInput>({
		defaultValues: {
			sentence: ""
		},
		resolver: yupResolver(schema)
	});
	const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
		let dataOutput: IData[] = [];
		if (dataForm.sentence.length > 0) {
			let dataInput: string[] = dataForm.sentence.split(" ");
			dataInput.forEach((elmt: string) => {
				if (elmt.length >= 2) {
					dataOutput.push({ label: elmt, count: elmt.length });
				}
			});
		}
		setData(dataOutput);
		setValue("sentence", "");
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Box
					sx={{
						width: "900px",
						height: "600px",
						border: `1px solid ${theme.palette.grey[400]}`,
						borderRadius: "8px",
						boxShadow: 2,
						display: "flex",
						flexDirection: "column",
						rowGap: "10px",
						justifyContent: "center",
						alignItems: "center",
						p: "20px"
					}}
				>
					<Controller
						name="sentence"
						defaultValue=""
						control={control}
						render={({ field }) => {
							return (
								<Box display="flex" flexDirection="column" rowGap={1} sx={{ width: "100%" }}>
									<MyTextField {...field} size="small" rows={2} fullWidth placeholder={t("Type message").toString()} />
									{errors.sentence && <Box color={theme.palette.error.main}>{errors.sentence.message}</Box>}
								</Box>
							);
						}}
					/>
					{data.length ? (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontSize: "18px", fontWeight: 800, color: theme.palette.grey[900] }}>
											Word
										</TableCell>
										<TableCell sx={{ fontSize: "18px", fontWeight: 800, color: theme.palette.grey[900], width: 200 }}>
											Number of letters
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map((elmt: IData, idx: number) => {
										return (
											<TableRow key={`sentence-idx-${idx}`}>
												<TableCell>{elmt.label}</TableCell>
												<TableCell sx={{ fontWeight: 900 }}>{elmt.count}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<React.Fragment></React.Fragment>
					)}
				</Box>
			</Box>
		</form>
	);
};

export default Excercise;
