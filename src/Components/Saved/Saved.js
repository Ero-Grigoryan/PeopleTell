import { useState, useEffect } from "react";
import "./saved.style.scss";

import { Link } from "react-router-dom";

import { v4 } from "uuid";

import { db, auth } from "../../FirebaseConfig/fbconfig";
import { collection, onSnapshot, query } from "firebase/firestore";

import PrevPost from "../PrevPost/PrevPost";

const Saved = () => {
	const [docs, setDocs] = useState([]);

	useEffect(() => {
		onSnapshot(query(collection(db, "savedPosts")), (snapshot) => {
			snapshot.docs.forEach((document) => {
				if (auth.currentUser.uid === document.id) {
					setDocs(document.data());
				}
			});
		});
	}, []);

	return (
		<div className="user_saved_posts_container">
			<div className="user_profile__saved_header_cont">
				<header>
					<div className="user_profile__saved_header_left_cont">
						<Link to="/">
							<h1>PeopleTell</h1>
						</Link>
					</div>
				</header>
			</div>

			<main className="saved_posts_bottom_container">
				{Object.keys(docs).length ? (
					Object.entries(docs).map((elem) => {
						return (
							<PrevPost
								key={v4()}
								postID={elem[1].postID}
								postTitle={elem[1].postTitle}
								postContent={elem[1].postContent}
								postImageRef={elem[1].postImageRef}
								postType={elem[1].postType}
								readingTime={elem[1].readingTime}
								readingTimeValue={elem[1].readingTimeValue}
								createdAt={elem[1].createdAt}
								userID={elem[1].userID}
								userName={elem[1].userName}
								savedPage={true}
								userAvatar={elem[1].userAvatar}
							/>
						);
					})
				) : (
					<div className="no_saved_posts_yet_container">
						<div className="no_saved_posts_yet_heading_container">
							<h2>No saved posts yet!</h2>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default Saved;
