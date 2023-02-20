import { useState } from "react";
import "./header.style.scss";

import { RxHamburgerMenu } from "react-icons/rx";
import { SiInstagram, SiPinterest, SiFacebook } from "react-icons/si";

import { Link, Navigate } from "react-router-dom";

import { auth } from "../../FirebaseConfig/fbconfig";

import Nav from "../Nav/Nav";

const Header = () => {
	const [burgerActive, setBurgerActive] = useState(false);
	const [clicked, setClicked] = useState(false);

	let openBurger = () => {
		setBurgerActive(!burgerActive);
	};

	let navigateToSignIn = () => {
		setClicked(true);
	};

	return (
		<>
			<div className="header_container">
				<header>
					<div className="header_left_cont">
						<SiFacebook />
						<SiInstagram />
						<SiPinterest />
					</div>

					<div onClick={openBurger} className="burger">
						<RxHamburgerMenu />
					</div>

					<div className="header_middle_cont">
						<h1>PeopleTell</h1>
					</div>

					<div className="header_right_cont">
						<div className="signIn_cont">
							{auth.currentUser ? (
								<Link
									to={`/UserProfile/${auth.currentUser.uid}`}
								>
									<img
										src={auth.currentUser?.photoURL}
										alt=""
									/>
								</Link>
							) : (
								<button onClick={navigateToSignIn}>
									Sign In
								</button>
							)}
						</div>
					</div>
				</header>

				{burgerActive && (
					<div className="burger_menu">
						<div className="burger_nav_cont">
							<Nav />
						</div>

						<div className="burger_signIn_cont">
							{auth.currentUser ? (
								<Link
									to={`/UserProfile/${auth.currentUser.uid}`}
								>
									<img
										src={auth.currentUser?.photoURL}
										alt=""
									/>
								</Link>
							) : (
								<button>
									<Link to="SignIn">Sign In</Link>
								</button>
							)}
						</div>

						<div className="burger_share_cont">
							<SiFacebook />
							<SiInstagram />
							<SiPinterest />
						</div>
					</div>
				)}

				<Nav />
			</div>

			{clicked && <Navigate to="SignIn" />}
		</>
	);
};

export default Header;
