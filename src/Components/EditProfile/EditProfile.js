import { useEffect, useState } from "react";
import "./editProfile.style.scss";

import { Link, Navigate } from "react-router-dom";

import { Formik, Field } from "formik";
import { editSchema } from "../../Assets/Schemas/EditSchema/editSchema";

import { auth, db, storage } from "../../FirebaseConfig/fbconfig";
import { updateProfile, updateEmail, deleteUser, signOut } from "firebase/auth";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	deleteDoc,
} from "firebase/firestore";

const EditProfile = () => {
	const [currentDoc, setCurrentDoc] = useState([]);
	const [updated, setUpdated] = useState(false);
	const [cancelEdit, setCanceldEdit] = useState(false);
	const [signedIn, setSignedIn] = useState(true);

	const name = auth.currentUser
		? auth.currentUser.displayName.split(" ")[0]
		: "";
	const surname = auth.currentUser
		? auth.currentUser.displayName.split(" ")[1]
		: "";

	const colRef = collection(db, "users");

	const storageRef = ref(
		storage,
		`gs://peopletell-9532a.appspot.com/UserAvatars/Avatar/${auth.currentUser.uid}`
	);

	useEffect(() => {
		getDocs(colRef).then((res) => {
			res.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.data().userID) {
					setCurrentDoc(doc.data());
				}
			});
		});
	}, []);

	let handleSubmitForm = async ({
		UserAvatar,
		Name,
		Surname,
		Username,
		Bio,
		Email,
	}) => {
		UserAvatar !== "" &&
			(await uploadBytes(storageRef, UserAvatar).then(() => {}));
		setUpdated(true);

		await updateDoc(doc(db, "users", currentDoc.userDocumentID), {
			Avatar:
				UserAvatar !== ""
					? await getDownloadURL(storageRef).then((url) => {
							return url;
					  })
					: currentDoc.Avatar,
			Name: Name,
			Surname: Surname,
			userName: "@" + Username.toLowerCase(),
			Bio: Bio || "",
			Email: Email,
		});

		await updateProfile(auth.currentUser, {
			photoURL: await getDownloadURL(storageRef).then((url) => {
				return url;
			}),
		});

		await updateEmail(auth.currentUser, Email);
	};

	let closeEditMenu = () => {
		setCanceldEdit(true);
	};

	let deleteUserAccount = async (auth) => {
		setSignedIn(false);
		signOutUser(auth);

		await deleteUser(auth.currentUser).then(() => {});

		await deleteDoc(doc(db, "users", currentDoc.userDocumentID));
	};

	let signOutUser = async (auth) => {
		setSignedIn(false);
		await signOut(auth);
	};

	return (
		<div className="edit_profile_container">
			<div className="user_profile_edit_header_cont">
				<header>
					<div className="user_profile_edit_header_left_cont">
						<Link to="/">
							<h1>PeopleTell</h1>
						</Link>
					</div>
				</header>
			</div>

			<div className="user_profile_edit_top_cont">
				<div className="user_top_avatar_cont">
					{auth.currentUser && (
						<img src={auth.currentUser.photoURL} alt="" />
					)}
				</div>
			</div>

			<div className="edit_profile_form_cont">
				<Formik
					initialValues={{
						UserAvatar: "",
						Name: name,
						Surname: surname,
						Username: (name + surname).toLowerCase(),
						Bio: "",
						Email: auth.currentUser ? auth.currentUser.email : "",
					}}
					validationSchema={editSchema}
					onSubmit={handleSubmitForm}
				>
					{({
						errors,
						touched,
						handleChange,
						handleSubmit,
						values,
						setFieldValue,
					}) => {
						return (
							<form onSubmit={handleSubmit} action="">
								<Field
									onChange={(e) => {
										setFieldValue(
											"UserAvatar",
											e.target.files[0]
										);
									}}
									value={""}
									name="UserAvatar"
									type="file"
								/>
								<Field
									value={values.Name}
									onChange={handleChange}
									name="Name"
									placeholder="Name"
									type="text"
								/>

								{errors.Name && touched.Name ? (
									<div className="edit_err_cont">
										<span>{errors.Name + "!"}</span>
									</div>
								) : null}

								<Field
									value={values.Surname}
									onChange={handleChange}
									name="Surname"
									placeholder="Surname"
									type="text"
								/>

								{errors.Surname && touched.Surname ? (
									<div className="edit_err_cont">
										<span>{errors.Surname + "!"}</span>
									</div>
								) : null}

								<Field
									value={values.Username}
									onChange={handleChange}
									name="Username"
									placeholder="Username"
									type="text"
								/>

								{errors.Username && touched.Username ? (
									<div className="edit_err_cont">
										<span>{errors.Username + "!"}</span>
									</div>
								) : null}

								<Field
									value={values.Bio}
									onChange={handleChange}
									name="Bio"
									placeholder="Bio"
									type="text"
								/>

								<Field
									value={values.Email}
									onChange={handleChange}
									name="Email"
									placeholder="Email"
									type="email"
								/>

								{errors.Email && touched.Email ? (
									<div className="edit_err_cont">
										<span>{errors.Email + "!"}</span>
									</div>
								) : null}

								<Field
									name="submit"
									type="submit"
									value="Save"
								/>
							</form>
						);
					}}
				</Formik>
			</div>

			<div className="edit_profile_cancel_button_cont">
				<button onClick={closeEditMenu}>Cancel</button>
			</div>

			<div className="edit_profile_delete_account_button_cont">
				<button onClick={() => deleteUserAccount(auth)}>
					Delete Account
				</button>
			</div>

			{updated && (
				<Navigate to={`/UserProfile/${auth.currentUser.uid}`} />
			)}
			{cancelEdit && (
				<Navigate to={`/UserProfile/${auth.currentUser.uid}`} />
			)}
			{signedIn || <Navigate to="/" />}
		</div>
	);
};

export default EditProfile;
