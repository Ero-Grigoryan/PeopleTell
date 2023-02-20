import { useEffect, useRef, useState } from "react";
import "./prevPost.style.scss";

import { BsBookmarkPlus, BsBookmarkDash, BsThreeDots } from "react-icons/bs";

import { Link, Navigate } from "react-router-dom";

import { auth, db, storage } from "../../FirebaseConfig/fbconfig";
import {
	getDownloadURL,
	ref,
	uploadBytes,
	deleteObject,
} from "firebase/storage";
import {
	deleteDoc,
	updateDoc,
	doc,
	collection,
	deleteField,
	setDoc,
	onSnapshot,
	query,
} from "firebase/firestore";

const PrevPost = ({
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
	userDoc,
	blogPage,
	savedPage,
	userAvatar,
}) => {
	const [savedPostsDoc, setSavedPostsDoc] = useState([]);
	const [otherMenuOpen, setOtherMenuOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [postOpened, setPostOpened] = useState(false);
	const [navigationPostID, setNavigationPostID] = useState("");

	const otherMenuContainerRef = useRef(null);
	const editModalRef = useRef(null);

	useEffect(() => {
		onSnapshot(query(collection(db, "savedPosts")), (snapshot) => {
			snapshot.docs.forEach((document) => {
				if (auth.currentUser.uid === document.id) {
					setSavedPostsDoc(document.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		editModalRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [editModalOpen]);

	useEffect(() => {
		otherMenuContainerRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [otherMenuOpen]);

	let openOtherMenu = () => {
		setOtherMenuOpen(!otherMenuOpen);
	};

	let openEditModal = () => {
		setEditModalOpen(true);
	};

	let closeEditModal = () => {
		setEditModalOpen(false);
	};

	let savePost = async () => {
		setDoc(
			doc(db, "savedPosts", auth.currentUser.uid),
			{
				[postID]: {
					saved: true,
					postID,
					postTitle,
					postContent,
					postImageRef,
					postType,
					readingTime,
					readingTimeValue,
					createdAt,
					userID,
					userAvatar,
					userName,
					savedUserID: auth.currentUser.uid,
				},
			},
			{ merge: true }
		);
	};

	let unSavePost = async (e) => {
		updateDoc(doc(db, "savedPosts", auth.currentUser.uid), {
			[postID]: deleteField(),
		});
	};

	let editPost = async (e) => {
		e.preventDefault();
		closeEditModal();
		let {
			postTitle,
			postContent,
			postImage,
			postType,
			readingTime,
			readingTimeValue,
		} = Object.fromEntries([...new FormData(e.target)]);

		postImage.size !== 0 &&
			(await uploadBytes(
				ref(
					storage,
					`gs://peopletell-9532a.appspot.com/postImages/${postImageRef.slice(
						75,
						129
					)}`
				),
				postImage
			).then(() => {}));

		await updateDoc(doc(db, "posts", postID), {
			postTitle: postTitle,
			postContent: postContent,
			postImageRef:
				postImage.size !== 0
					? await getDownloadURL(
							ref(
								storage,
								`gs://peopletell-9532a.appspot.com/postImages/${postImageRef.slice(
									75,
									129
								)}`
							)
					  ).then((url) => {
							return url;
					  })
					: postImageRef,
			postType: postType,
			readingTime: readingTime,
			readingTimeValue: readingTimeValue,
		});

		setEditModalOpen(false);
	};

	let deletePost = async () => {
		await updateDoc(doc(db, "users", userDoc.userDocumentID), {
			postsCount: userDoc.postsCount - 1,
		});
		await deleteDoc(doc(db, "posts", postID));

		await deleteObject(
			ref(
				storage,
				`gs://peopletell-9532a.appspot.com/postImages/${postImageRef.slice(
					88,
					129
				)}`
			)
		).then(() => {});
	};

	let openPost = (e) => {
		if (e.target.matches("svg")) {
			return;
		}

		setNavigationPostID(postID);
		setPostOpened(true);
	};

	return (
		<>
			{blogPage || savedPage || <hr />}
			{editModalOpen ? (
				<div ref={editModalRef} className="post_edit_modal_connt">
					<form onSubmit={editPost} action="">
						<input
							name="postTitle"
							placeholder="Enter a title"
							type="text"
							defaultValue={postTitle}
						/>

						<textarea
							name="postContent"
							id=""
							cols="30"
							rows="10"
							placeholder="Enter a content"
							defaultValue={postContent}
						></textarea>

						<input name="postImage" type="file" />

						<div className="edit_post_post_type_read_time_cont">
							<div className="edit_post_post_type_cont">
								<input
									name="postType"
									placeholder="Post type"
									type="text"
									defaultValue={postType}
								/>
							</div>

							<div className="edit_post_read_time_cont">
								<input
									name="readingTime"
									placeholder="Reading time"
									type="number"
									defaultValue={readingTime}
								/>

								<select
									defaultValue={readingTimeValue}
									name="readingTimeValue"
									id=""
								>
									<option value="minutes">Minutes</option>

									<option value="hours">Hours</option>
								</select>
							</div>
						</div>

						<input type="submit" value="Save" />
					</form>

					<div className="post_edit_cancel_button_cont">
						<button onClick={closeEditModal}>Cancel</button>
					</div>
				</div>
			) : (
				<div className="post_container">
					<div className="post_top_container">
						<div className="post_top_user_avatar_cont">
							<img src={userAvatar} alt="" />
						</div>

						<div className="post_top_user_name_cont">
							<Link to={`/UserProfile/${userID}`}>
								{userName}
							</Link>
						</div>

						<div className="post_top_data_cont">
							<span>
								{createdAt?.toDate().toString().slice(4, 21)}
							</span>
						</div>
					</div>

					<div onClick={openPost} className="post_middle_container">
						<div className="post_middle_left_cont">
							<div className="post_middle_heading_cont">
								<h2>{postTitle}</h2>
							</div>

							<div className="post_middle_paragraph_cont">
								<p>{postContent.slice(0, 30)}</p>
							</div>
						</div>

						{postImageRef !== "" && (
							<div className="post_middle_right_cont">
								<img src={postImageRef} alt="" />
							</div>
						)}
					</div>

					<div className="post_bottom_container">
						<div className="post_bottom_left_cont">
							<div className="post_bottom_type_cont">
								<span>{postType}</span>
							</div>

							<div className="post_bottom_reading_time_cont">
								<span>
									{readingTime +
										" " +
										readingTimeValue +
										" read"}
								</span>
							</div>
						</div>

						<div className="post_bottom_right_cont">
							<div
								onClick={
									savedPostsDoc[postID]?.saved
										? unSavePost
										: savePost
								}
								className="post_bottom_right_save_post_cont"
							>
								{savedPostsDoc[postID]?.saved ? (
									<BsBookmarkDash />
								) : (
									<BsBookmarkPlus />
								)}
							</div>

							{userID === auth.currentUser.uid ? (
								<div
									onClick={openOtherMenu}
									className="post_bottom_other_cont"
								>
									<BsThreeDots />
								</div>
							) : null}
						</div>
					</div>

					{otherMenuOpen && (
						<div
							ref={otherMenuContainerRef}
							className="other_menu_container"
						>
							<div className="other_menu_edit_cont">
								<button onClick={openEditModal}>Edit</button>
							</div>
							<div className="other_menu_delete_cont">
								<button onClick={deletePost}>Delete</button>
							</div>
						</div>
					)}
				</div>
			)}

			{postOpened && <Navigate to={"/Post/" + navigationPostID} />}
			{blogPage || savedPage || <hr />}
		</>
	);
};

export default PrevPost;
