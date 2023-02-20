import { useState, useEffect } from "react";
import "./signUp.style.scss";

import { Navigate, Link } from "react-router-dom";

import { Formik, Field } from "formik";
import { basicSchema } from "../../Assets/Schemas/BasicValidationSchema/basicSchema";

import { storage, db, signUpUser, auth } from "../../FirebaseConfig/fbconfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

import signUpImage from "../../Assets/Images/SignInSignUp/Saly-14.svg";

const SignUp = () => {
	const [signed, setSigned] = useState(false);
	const [defaultAvatar, setDefaultAvatar] = useState("");
	const [defaultBackground, setDefaultBackground] = useState("");
	const [error, setError] = useState("");

	const defaultUserAvatarRef = ref(
		storage,
		"gs://peopletell-9532a.appspot.com/Images/defaultAvatar.png"
	);

	const defaultUserBackgroundRef = ref(
		storage,
		"gs://peopletell-9532a.appspot.com/Images/DefaultProfileBackground.jpg"
	);

	const colRef = collection(db, "users");

	useEffect(() => {
		getDownloadURL(defaultUserAvatarRef).then((ref) => {
			setDefaultAvatar(ref);
		});

		getDownloadURL(defaultUserBackgroundRef).then((ref) => {
			setDefaultBackground(ref);
		});
	}, []);

	let handleSubmitForm = async ({ Name, Surname, Email, Password }) => {
		await signUpUser(auth, Email, Password).catch((err) => {
			setError(err.message.split("/")[1].slice(0, -2));
		});
		await updateProfile(auth.currentUser, {
			displayName: Name + " " + Surname,
			photoURL: defaultAvatar,
		}).then(() => {
			setSigned(true);
		});

		await addDoc(colRef, {
			Name: Name,
			Surname: Surname,
			Email: Email,
			Password: Password,
			Avatar: defaultAvatar,
			background: defaultBackground,
			Bio: "",
			postsCount: 0,
			followersCount: 0,
			followingCount: 0,
			userName: "@" + (Name + Surname).toLowerCase(),
			userID: auth.currentUser.uid,
		}).then((userRef) => {
			updateDoc(doc(db, "users", userRef.id), {
				userDocumentID: userRef.id,
			});
		});
	};

	return (
		<div className="signUp_container">
			<div className="signUp_top_container">
				<header>
					<Link to="/">
						<h1>PeopleTell</h1>
					</Link>
				</header>
			</div>

			<div className="signUp_bottom_container">
				<div className="signUp_bottom_left_cont">
					<div className="signUp_bottom_left_top_cont">
						<span>Sign Up to</span>
						<span>
							<strong>PeopleTell </strong> is simply
						</span>
					</div>

					<div className="signUp_bottom_left_signIn_cont">
						<span>if you already have an account</span>
						<span>
							You can <Link to="/SignIn">Login here!</Link>
						</span>
					</div>

					<div className="signUp_bottom_left_image_container">
						<img src={signUpImage} alt="" />
					</div>
				</div>

				<div className="signUp_bottom_right_cont">
					<div className="signUp_right_top_cont">
						<h2>Sign Up</h2>
					</div>

					<div className="signUp_middle_cont">
						<Formik
							initialValues={{
								Name: "",
								Surname: "",
								Email: "",
								Password: "",
							}}
							validationSchema={basicSchema}
							onSubmit={handleSubmitForm}
						>
							{({
								errors,
								touched,
								handleChange,
								handleSubmit,
								values,
							}) => {
								return (
									<form onSubmit={handleSubmit} action="">
										<Field
											name="Name"
											placeholder="Name"
											type="text"
											value={values.Name}
											onChange={handleChange}
										/>

										{errors.Name && touched.Name ? (
											<div className="reg_err_cont">
												<span>{errors.Name + "!"}</span>
											</div>
										) : null}

										<Field
											name="Surname"
											placeholder="Surname"
											type="text"
											value={values.Surname}
											onChange={handleChange}
										/>

										{errors.Surname && touched.Surname ? (
											<div className="reg_err_cont">
												<span>
													{errors.Surname + "!"}
												</span>
											</div>
										) : null}

										<Field
											name="Email"
											placeholder="Email"
											type="email"
											value={values.Email}
											onChange={handleChange}
										/>

										{errors.Email && touched.Email ? (
											<div className="reg_err_cont">
												<span>
													{errors.Email + "!"}
												</span>
											</div>
										) : null}

										<Field
											name="Password"
											placeholder="Password"
											type="password"
											value={values.Password}
											onChange={handleChange}
										/>

										{errors.Password && touched.Password ? (
											<div className="reg_err_cont">
												<span>
													{errors.Password + "!"}
												</span>
											</div>
										) : null}

										{error && (
											<div className="signUp_error_cont">
												<span>{error}</span>
											</div>
										)}
										<Field value="Register" type="submit" />
									</form>
								);
							}}
						</Formik>
					</div>
				</div>
			</div>

			{signed && <Navigate to="/" />}
		</div>
	);
};

export default SignUp;
