import React from "react";
import "./about.style.scss";

import {
	SiInstagram,
	SiTwitter,
	SiPinterest,
	SiFacebook,
} from "react-icons/si";

import { Link } from "react-router-dom";

const About = () => {
	return (
		<div className="about_page_container">
			<div className="about_page_header_cont">
				<header>
					<Link to="/">
						<h1>Peopletell</h1>
					</Link>
				</header>
			</div>

			<div className="about_page_main_cont">
				<main>
					<div className="about_page_main_heading_cont">
						<h2>About</h2>
					</div>

					<div className="about_page_main_content_cont">
						<p>
							Welcome to Peopletell. The project was thought up
							<br />
							for a portfolio, The Meaning of the Project is
							<br />
							Blogging. The project was created so that people who
							<br />
							come in can write their blogs, share their life
							<br />
							stories, share their experiences, and motivate other
							<br />
							people who are striving for their goal or for text
							<br />
							who are striving to help achieve their goal.
							<br />
							if you have any questions or you have found
							<br />
							problems, you can write to us in the{" "}
							<Link to="/Contact">Contact</Link> section.
							<br />
							<br />
							<strong> @peopletell</strong>
							<br />
							<br />
							Our Social Medias
							<br />
							<br />
							<SiInstagram />
							<SiTwitter />
							<SiPinterest />
							<SiFacebook />
						</p>
					</div>
				</main>
			</div>
		</div>
	);
};

export default About;
