import { useState, useEffect } from "react";
import "./followersPage.style.scss";

import { Link, useLocation } from "react-router-dom";

import { v4 } from "uuid";

import { db } from "../../FirebaseConfig/fbconfig";
import { collection, getDocs } from "firebase/firestore";

import UserAccount from "../UserAccount/UserAccount";

const FollowersPage = () => {
	const [usersDoc, setUsersDoc] = useState([]);

	const { pathname } = useLocation();
	const pathUserID = pathname.split("/")[2];

	useEffect(() => {
		getDocs(collection(db, "followersDoc")).then((res) => {
			res.docs.forEach((doc) => {
				if (pathUserID === doc.id) {
					setUsersDoc(doc.data());
				}
			});
		});
	}, []);

	return (
		<div className="followers_page_cont">
			<div className="followers_page_header_cont">
				<header>
					<Link to="/">
						<h1>PeopleTell</h1>
					</Link>
				</header>
			</div>

			<div className="follower_page_heading_cont">
				<h2>Followers</h2>
			</div>

			<div className="followers_page_followers_cont">
				{Object.keys(usersDoc).length ? (
					Object.entries(usersDoc).map((elem) => {
						return (
							<UserAccount
								key={v4()}
								userAvatar={elem[1].userPhoto}
								userName={elem[1].userName}
								userSurname={elem[1].userSurname}
								userID={elem[1].userID}
							/>
						);
					})
				) : (
					<div className="no_followers_container">
						<div className="no_followers_heading_container">
							<h2>No followers</h2>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FollowersPage;
