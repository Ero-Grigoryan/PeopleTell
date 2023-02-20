import { useState, useEffect } from "react";
import "./post.style.scss";

import { FcLike, FcDislike } from "react-icons/fc";

import { useLocation, Link } from "react-router-dom";

import { v4 } from "uuid";

import { auth, db } from "../../FirebaseConfig/fbconfig";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
	onSnapshot,
	query,
	orderBy,
	setDoc,
	deleteField,
} from "firebase/firestore";

import Comment from "../Comment/Comment";

const Post = () => {
	const [postDoc, setPostDoc] = useState([]);
	const [commentsDoc, setCommentsDoc] = useState([]);
	const [likedPostsDoc, setLikedPostsDoc] = useState([]);
	const [dislikedPostsDoc, setDislikedPostsDoc] = useState([]);
	const [comment, setComment] = useState("");
	const { pathname } = useLocation();

	const {
		postTitle,
		postContent,
		userName,
		postImageRef,
		postID,
		createdAt,
		likesCount,
		dislikesCount,
	} = postDoc;

	const commentsColRef = collection(db, "comments");

	useEffect(() => {
		onSnapshot(
			query(collection(db, "comments"), orderBy("createdAt", "desc")),
			(snapshot) => {
				let commentsArr = [];
				snapshot.docs.forEach((document) => {
					if (pathname.split("/")[2] === document.data().postID) {
						commentsArr.push(document.data());
					}
				});

				setCommentsDoc(commentsArr);
			}
		);
	}, []);

	useEffect(() => {
		onSnapshot(query(collection(db, "postLikes")), (snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.id) {
					setLikedPostsDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(query(collection(db, "postDislikes")), (snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.id) {
					setDislikedPostsDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(doc(db, "posts", pathname.split("/")[2]), (res) => {
			setPostDoc(res.data());
		});
	}, []);

	let likePost = (e) => {
		e.preventDefault();

		setDoc(
			doc(db, "postLikes", auth.currentUser.uid),
			{
				[postID]: true,
			},
			{ merge: true }
		);

		updateDoc(doc(db, "posts", postID), {
			likesCount: likesCount + 1,
		});
	};

	let removeLike = (e) => {
		e.preventDefault();

		updateDoc(doc(db, "postLikes", auth.currentUser.uid), {
			[postID]: deleteField(),
		});

		updateDoc(doc(db, "posts", postID), {
			likesCount: likesCount - 1,
		});
	};

	let dislikePost = (e) => {
		e.preventDefault();

		setDoc(
			doc(db, "postDislikes", auth.currentUser.uid),
			{
				[postID]: true,
			},
			{ merge: true }
		);

		updateDoc(doc(db, "posts", postID), {
			dislikesCount: dislikesCount + 1,
		});
	};

	let removeDislike = (e) => {
		e.preventDefault();

		updateDoc(doc(db, "postDislikes", auth.currentUser.uid), {
			[postID]: deleteField(),
		});

		updateDoc(doc(db, "posts", postID), {
			dislikesCount: dislikesCount - 1,
		});
	};

	let addComment = (e) => {
		e.preventDefault();
		let { comment } = Object.fromEntries([...new FormData(e.target)]);

		addDoc(commentsColRef, {
			userName: auth.currentUser.displayName,
			userAvatar: auth.currentUser.photoURL,
			likes: 0,
			dislikes: 0,
			comment,
			postID,
			userID: auth.currentUser.uid,
			createdAt: serverTimestamp(),
		}).then((docRef) => {
			updateDoc(doc(db, "comments", docRef.id), {
				commentID: docRef.id,
			});
		});

		setComment("");
	};

	console.log(postImageRef);

	return (
		<div className="post_opened_container">
			<div className="post_opened_header_cont">
				<header>
					<Link to="/">
						<h1>Peopletell</h1>
					</Link>
				</header>
			</div>
			<div className="post_opened_main_cont">
				<main>
					<div className="post_opened_main_heading_cont">
						<h2>{postTitle}</h2>
					</div>

					{postImageRef !== "" && (
						<div className="post_opened_main_picture_cont">
							<figure>
								<img src={postImageRef} alt="" />
							</figure>
						</div>
					)}

					<div className="post_opened_main_content_cont">
						<p>{postContent}</p>
					</div>

					<div className="post_opened_main_author_name_cont">
						<span>Created by {userName}</span>
					</div>

					<div className="post_opened_main_created_at_cont">
						<span>
							{createdAt?.toDate().toString().slice(4, 21)}
						</span>
					</div>

					<div className="post_opened_main_like_dislike_cont">
						<div
							onClick={
								likedPostsDoc[postID] ? removeLike : likePost
							}
							className="post_like_cont"
						>
							<div className="post_like_icon_cont">
								<FcLike />
							</div>
							<div className="post_like_count_cont">
								<span>{likesCount}</span>
							</div>
						</div>
						<div
							onClick={
								dislikedPostsDoc[postID]
									? removeDislike
									: dislikePost
							}
							className="post_dislike_cont"
						>
							<div className="post_dislike_icon_cont">
								<FcDislike />
							</div>
							<div className="post_dislike_count_cont">
								<span>{dislikesCount}</span>
							</div>
						</div>
					</div>
				</main>

				<div className="post_opened_footer_cont">
					<footer>
						<div className="post_opened_footer_comments_section_container">
							<section>
								<div className="post_opened_comment_writing_cont">
									<div className="post_opened_comment_writing_heading_cont">
										<span>Comments</span>
									</div>

									<hr />

									<div className="post_opened_comment_writing_form_cont">
										<form onSubmit={addComment} action="">
											<textarea
												name="comment"
												id=""
												cols="30"
												rows="10"
												placeholder="Your comment"
												value={comment}
												onChange={(e) =>
													setComment(e.target.value)
												}
											></textarea>
											<input type="submit" value="Add" />
										</form>
									</div>
								</div>

								<div className="post_opened_comments_cont">
									{commentsDoc.length
										? commentsDoc.map(
												({
													userAvatar,
													userName,
													comment,
													commentID,
													userID,
													createdAt,
													likes,
													dislikes,
												}) => {
													return (
														<Comment
															key={v4()}
															userAvatar={
																userAvatar
															}
															userName={userName}
															comment={comment}
															commentID={
																commentID
															}
															userID={userID}
															createdAt={
																createdAt
															}
															likes={likes}
															dislikes={dislikes}
														/>
													);
												}
										  )
										: null}
								</div>
							</section>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
};

export default Post;
