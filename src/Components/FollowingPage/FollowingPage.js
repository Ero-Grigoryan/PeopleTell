import { useEffect, useState } from "react";
import "./followingPage.style.scss";

import { Link, useLocation } from "react-router-dom";

import { v4 } from "uuid";

import { db } from "../../FirebaseConfig/fbconfig";
import { collection, getDocs } from "firebase/firestore";

import UserAccount from "../UserAccount/UserAccount";

const FollowingPage = () => {
	const [usersDoc, setUsersDoc] = useState([]);

	const { pathname } = useLocation();
	const pathUserID = pathname.split("/")[2];

	useEffect(() => {
		getDocs(collection(db, "followingDoc")).then((res) => {
			res.docs.forEach((doc) => {
				if (pathUserID === doc.id) {
					setUsersDoc(doc.data());
				}
			});
		});
	}, []);

	return (
		<div className="following_page_cont">
			<div className="following_page_header_cont">
				<header>
					<Link to="/">
						<h1>PeopleTell</h1>
					</Link>
				</header>
			</div>

			<div className="following_page_heading_cont">
				<h2>Following</h2>
			</div>

			<div className="following_page_following_cont">
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
					<div className="no_following_container">
						<div className="no_following_heading_container">
							<h2>No following</h2>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FollowingPage;
