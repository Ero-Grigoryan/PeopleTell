import React from "react";
import "./nav.style.scss";

import { NavLink } from "react-router-dom";

import { auth } from "../../FirebaseConfig/fbconfig";

const Nav = () => {
	return (
		<nav>
			<ul>
				<li>
					<NavLink to="/">Main</NavLink>
				</li>
				<li>
					<NavLink to="About">About</NavLink>
				</li>
				<li>
					<NavLink to={auth.currentUser ? "Blog" : "SignIn"}>
						Blog
					</NavLink>
				</li>
				<li>
					<NavLink to="Contact">Contact</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;
