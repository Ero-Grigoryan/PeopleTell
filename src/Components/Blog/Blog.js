import { useState, useEffect } from "react";
import "./blog.style.scss";

import { Link } from "react-router-dom";

import { v4 } from "uuid";

import { db } from "../../FirebaseConfig/fbconfig";
import {
	getDocs,
	collection,
	query,
	orderBy,
	onSnapshot,
} from "firebase/firestore";

import PrevPost from "../PrevPost/PrevPost";

const Blog = () => {
	const [userDoc, setUserDoc] = useState([]);
	const [postDoc, setPostDoc] = useState([]);

	const usersColRef = collection(db, "users");

	useEffect(() => {
		onSnapshot(
			query(collection(db, "posts"), orderBy("createdAt", "desc")),
			(snapshot) => {
				let postArr = [];
				snapshot.docs.forEach((document) => {
					postArr.push(document.data());
				});

				setPostDoc(postArr);
			}
		);
	}, []);

	useEffect(() => {
		getDocs(usersColRef).then((res) => {
			res.docs.forEach((doc) => {
				setUserDoc(doc.data());
			});
		});
	}, []);

	return (
		<div className="blog_page_container">
			<div className="blog_page_header_cont">
				<header>
					<Link to="/">
						<h1>Peopletell</h1>
					</Link>
				</header>
			</div>

			<div className="blog_page_main_cont">
				<div className="blog_page_heading_cont">
					<h2>Blog</h2>
				</div>

				<main>
					<div className="blog_main_pre_heading_cont">
						<h3>Whats new?</h3>
					</div>

					<div className="blog_main_posts_cont">
						{postDoc.length ? (
							postDoc.map(
								({
									postID,
									postTitle,
									postContent,
									postImageRef,
									postType,
									readingTime,
									readingTimeValue,
									createdAt,
									userID,
									userName,
									userAvatar,
								}) => {
									return (
										<PrevPost
											key={v4()}
											postID={postID}
											postTitle={postTitle}
											postContent={postContent}
											postImageRef={postImageRef}
											postType={postType}
											readingTime={readingTime}
											readingTimeValue={readingTimeValue}
											createdAt={createdAt}
											userID={userID}
											userName={userName}
											userDoc={userDoc}
											blogPage={true}
											userAvatar={userAvatar}
										/>
									);
								}
							)
						) : (
							<div className="blog_page_no_posts_container">
								<div className="blog_page_no_posts_heading_container">
									<h2>No posts yet</h2>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default Blog;
