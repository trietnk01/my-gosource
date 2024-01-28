import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Card, Grid, IconButton, MenuItem, stepClasses, useTheme } from "@mui/material";
import { IconX } from "@tabler/icons";
import sprite from "assets/images/sprite.png";
import { MySelectField, MyTextField } from "control";
import { MyLabelField } from "control/MyLabelField";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { DefaultRootStateProps } from "types";
import axios from "utils/axios";
import * as yup from "yup";
interface IFormInput {
	code: string;
	ho_ten: string;
	nam_hoc: string;
	lop_hoc_id: number;
	avatar: string;
}
interface IStudent {
	id: number;
	code: string;
	ho_ten: string;
	nam_hoc: string;
	lop_hoc_id: number;
	avatar: string;
}
interface IClass {
	id: number;
	ten_lop: string;
}
const StudentFrm = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { t } = useTranslation();
	let mounted: boolean = true;
	const { id } = useParams();
	const [base64Url, setBase64Url] = React.useState<string>("");
	const [classessList, setClassesList] = React.useState<IClass[]>([{ id: 0, ten_lop: "Vui lòng chọn lớp" }]);
	const [avatar, setAvatar] = React.useState<DefaultRootStateProps["MediaSource"] | null>(null);
	const [removedAvatar, setRemovedAvatar] = React.useState<boolean>(false);
	const schema = yup
		.object({
			code: yup.string().required(t("Field required").toString()),
			ho_ten: yup.string().required(t("Field required").toString()),
			nam_hoc: yup.string().required(t("Field required").toString())
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
			code: "",
			ho_ten: "",
			nam_hoc: "",
			lop_hoc_id: 0,
			avatar: ""
		},
		resolver: yupResolver(schema)
	});
	const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
		try {
			let checked: boolean = true;
			let action: string = id ? "UPDATE" : "CREATE";
			if (checked) {
				let frmData: any = new FormData();
				frmData.append("code", dataForm.code.toString().trim());
				frmData.append("ho_ten", dataForm.ho_ten.toString().trim());
				frmData.append("nam_hoc", dataForm.nam_hoc);
				frmData.append("lop_hoc_id", dataForm.lop_hoc_id);
				switch (action) {
					case "CREATE":
						if (avatar) {
							frmData.append("avatar", avatar);
						}
						break;
					case "UPDATE":
						if (avatar) {
							frmData.append("avatar", avatar);
						} else {
							if (removedAvatar) {
								frmData.append("removed_avatar", removedAvatar);
							}
						}
						break;
				}
				let res: any = null;
				switch (action) {
					case "CREATE":
						res = await axios.post("/students/create", frmData, {
							headers: { isShowLoading: true, ContentType: "multipart/form-data" }
						});
						break;
					case "UPDATE":
						if (id) {
							res = await axios.post(`/students/update/${parseInt(id.toString())}`, frmData, {
								headers: { isShowLoading: true, ContentType: "multipart/form-data" }
							});
						}
						break;
				}
				const { status, insert_id } = res.data;
				if (status) {
					if (action === "CREATE") {
						navigate(`/admin/student/edit/${insert_id}`);
					}
					dispatch(
						openSnackbar({
							open: true,
							message: action === "CREATE" ? t("Create student successfully") : t("Update student successfully"),
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
							message: t("Save student failure"),
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
				const resClasses: any = await axios.get(`/classes/list`);
				const { status, items } = resClasses.data;
				let classesData: IClass[] = [];
				if (status) {
					classesData = items ? items : [];
				}
				classesData.unshift({ id: 0, ten_lop: "Vui lòng chọn tên lớp" });
				let code: string = "";
				let ho_ten: string = "";
				let nam_hoc: string = "";
				let avatar: string = "";
				let lop_hoc_id: number = 0;
				if (id) {
					const resStudents: any = await axios.get(`/students/show/${parseInt(id.toString())}`, {
						headers: { isShowLoading: true }
					});
					const { status, item } = resStudents.data;
					if (status) {
						const studentElmt: IStudent = item ? item : null;
						if (studentElmt) {
							code = studentElmt.code ? studentElmt.code : "";
							ho_ten = studentElmt.ho_ten ? studentElmt.ho_ten : "";
							nam_hoc = studentElmt.nam_hoc ? studentElmt.nam_hoc : "";
							lop_hoc_id = studentElmt.lop_hoc_id;
							avatar = studentElmt.avatar;
						}
					} else {
						dispatch(
							openSnackbar({
								open: true,
								message: t("Student detail shown failure"),
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
					setClassesList(classesData);
					setValue("code", code);
					setValue("ho_ten", ho_ten);
					setValue("nam_hoc", nam_hoc);
					setValue("lop_hoc_id", lop_hoc_id);
					setBase64Url(avatar);
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
	const handleUpload = (avatarFile: any) => {
		setBase64Url(URL.createObjectURL(avatarFile));
		setAvatar(avatarFile);
	};
	const handleRemovedAvatar = () => {
		setBase64Url("");
		setAvatar(null);
		setRemovedAvatar(true);
	};
	return (
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
					{t("Student information")}
				</Box>
				<Box display="flex" columnGap={2}>
					<Button
						variant="contained"
						startIcon={<KeyboardBackspaceOutlinedIcon />}
						onClick={() => navigate("/admin/student/list")}
					>
						{t("Back")}
					</Button>
					<Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/admin/student/add")}>
						{t("Add student")}
					</Button>
				</Box>
			</Box>
			<Box p={2}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={3}>
						<Card variant="outlined" sx={{ p: 2 }}>
							{base64Url ? (
								<Box display="flex" flexDirection="column" alignItems="center" rowGap={2}>
									<img src={base64Url} style={{ width: "100%", height: "100%", borderRadius: 6 }} />
									<IconButton
										sx={{
											background: theme.palette.error.dark,
											color: "white",
											boxShadow: 4,
											"&:hover": { background: theme.palette.error.main }
										}}
										onClick={handleRemovedAvatar}
										size="small"
									>
										<IconX />
									</IconButton>
								</Box>
							) : (
								<FileUploader
									name="avatar_file_upload"
									multiple={false}
									types={["JPG", "PNG", "GIF", "JPEG"]}
									hoverTitle={t("Drop here")}
									handleChange={handleUpload}
								>
									<Box
										display="flex"
										flexDirection="column"
										alignItems="center"
										rowGap={2}
										border={2}
										borderRadius={3}
										p={2}
										sx={{ borderStyle: "dashed", borderColor: theme.palette.grey[400], cursor: "pointer" }}
									>
										<img alt="spriteMultipleUpload" style={{ width: "50%" }} src={sprite} />
										<Box sx={{ color: theme.palette.grey[800], fontWeight: 900 }} fontSize={20}>
											{t("Upload image right here")}
										</Box>
										<Box sx={{ color: theme.palette.grey[600] }} fontSize={16}>
											{t("Maxium 5MB")}
										</Box>
									</Box>
								</FileUploader>
							)}
						</Card>
					</Grid>
					<Grid item xs={12} sm={9}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Card variant="outlined" sx={{ p: 2 }}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<Box display="flex" flexDirection="column">
											<Box display="flex" alignItems="center" columnGap={1}>
												<MyLabelField>{t("Mã sinh viên")}</MyLabelField>
												<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
											</Box>
											<Controller
												name="code"
												defaultValue=""
												control={control}
												render={({ field }) => {
													return (
														<Box display="flex" flexDirection="column" rowGap={1}>
															<MyTextField {...field} size="small" fullWidth type="text" />
															{errors.code && (
																<Box color={theme.palette.error.main}>{errors.code.message}</Box>
															)}
														</Box>
													);
												}}
											/>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box display="flex" flexDirection="column">
											<Box display="flex" alignItems="center" columnGap={1}>
												<MyLabelField>{t("Họ tên")}</MyLabelField>
												<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
											</Box>
											<Controller
												name="ho_ten"
												defaultValue=""
												control={control}
												render={({ field }) => {
													return (
														<Box display="flex" flexDirection="column" rowGap={1}>
															<MyTextField {...field} size="small" fullWidth type="text" />
															{errors.ho_ten && (
																<Box color={theme.palette.error.main}>{errors.ho_ten.message}</Box>
															)}
														</Box>
													);
												}}
											/>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box display="flex" flexDirection="column">
											<Box display="flex" alignItems="center" columnGap={1}>
												<MyLabelField>{t("Năm học")}</MyLabelField>
												<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
											</Box>
											<Controller
												name="nam_hoc"
												defaultValue=""
												control={control}
												render={({ field }) => {
													return (
														<Box display="flex" flexDirection="column" rowGap={1}>
															<MyTextField {...field} size="small" fullWidth type="text" />
															{errors.nam_hoc && (
																<Box color={theme.palette.error.main}>{errors.nam_hoc.message}</Box>
															)}
														</Box>
													);
												}}
											/>
										</Box>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Box display="flex" flexDirection="column">
											<Box display="flex" alignItems="center" columnGap={1}>
												<MyLabelField>{t("Lớp học")}</MyLabelField>
												<Box sx={{ color: theme.palette.error.main, fontWeight: 900 }}>*</Box>
											</Box>
											<Controller
												name="lop_hoc_id"
												control={control}
												render={({ field }) => {
													return (
														<Box display="flex" flexDirection="column" rowGap={1}>
															<MySelectField {...field} size="small" fullWidth>
																{classessList.length > 0 &&
																	classessList.map((classElmt: IClass, idx: number) => {
																		return (
																			<MenuItem value={classElmt.id} key={`lop-hoc-${idx}`}>
																				{classElmt.ten_lop}
																			</MenuItem>
																		);
																	})}
															</MySelectField>
															{errors.lop_hoc_id && (
																<Box color={theme.palette.error.main}>{errors.lop_hoc_id.message}</Box>
															)}
														</Box>
													);
												}}
											/>
										</Box>
									</Grid>
									<Grid item xs={12} sm={12} display="flex" justifyContent="flex-end">
										<Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>
											{t("Save")}
										</Button>
									</Grid>
								</Grid>
							</Card>
						</form>
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
};

export default StudentFrm;
