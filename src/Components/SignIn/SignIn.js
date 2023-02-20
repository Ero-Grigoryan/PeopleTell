import { useState } from "react";
import "./signIn.style.scss";

import { Navigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, signInUser } from "../../FirebaseConfig/fbconfig";

import signInImage from "../../Assets/Images/SignInSignUp/Saly-14.svg";

const SignIn = () => {
	const [logedIn, setLogedIn] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");

	let handleSubmit = async (e) => {
		e.preventDefault();
		let { Email, Password } = Object.fromEntries([
			...new FormData(e.target),
		]);

		await signInUser(auth, Email, Password)
			.then(() => {
				setLogedIn(true);
			})
			.catch((err) => {
				setError(err.message.split("/")[1].slice(0, -2));
			});
	};

	let handleChange = (e) => {
		setEmail(e.target.value);
	};

	let resetUserPasswordEmail = async (email) => {
		await sendPasswordResetEmail(auth, email)
			.then(() => {})
			.catch((err) => {
				setError(err.message.split("/")[1].slice(0, -2));
			});
	};

	return (
		<div className="signIn_container">
			<div className="signIn_top_container">
				<header>
					<Link to="/">
						<h1>PeopleTell</h1>
					</Link>
				</header>
			</div>

			<div className="signIn_bottom_container">
				<div className="signIn_bottom_left_cont">
					<div className="signIn_bottom_left_top_cont">
						<span>Sign in to</span>
						<span>
							<strong>PeopleTell </strong> is simply
						</span>
					</div>

					<div className="signIn_bottom_left_signUp_cont">
						<span>if you don't have an account</span>
						<span>
							You can <Link to="/SignUp">Register here!</Link>
						</span>
					</div>

					<div className="signIn_bottom_left_image_container">
						<img src={signInImage} alt="" />
					</div>
				</div>

				<div className="signIn_bottom_right_cont">
					<div className="signIn_right_top_cont">
						<h2>Sign in</h2>
					</div>

					<div className="signIn_middle_cont">
						<form onSubmit={handleSubmit} action="">
							<input
								name="Email"
								onChange={handleChange}
								placeholder="Email"
								type="text"
							/>
							<input
								name="Password"
								placeholder="Password"
								type="password"
							/>

							{error && (
								<div className="signIn_error_cont">
									<span>{error}</span>
								</div>
							)}

							<div className="forgot_password_cont">
								<span
									onClick={() => {
										resetUserPasswordEmail(email);
										if (email) {
											setForgotPassword(true);
											setTimeout(() => {
												setForgotPassword(false);
											}, 2000);
										}
									}}
								>
									{forgotPassword
										? "Email sent"
										: "Forgot password?"}
								</span>
							</div>

							<input value="Login" type="submit" />
						</form>
					</div>
				</div>
			</div>

			{logedIn && <Navigate to="/" />}
		</div>
	);
};

export default SignIn;
