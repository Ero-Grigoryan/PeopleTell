import { useState, useEffect } from "react";
import "./comment.style.scss";

import { FcLike, FcDislike } from "react-icons/fc";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import { auth, db } from "../../FirebaseConfig/fbconfig";
import {
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDocs,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";

const Comment = ({
	userAvatar,
	userName,
	comment,
	commentID,
	userID,
	createdAt,
	likes,
	dislikes,
}) => {
	const [likedCommentsDoc, setLikedCommentsDoc] = useState([]);
	const [dislikedCommentsDoc, setdislikedCommentsDoc] = useState([]);
	const [editModalOpen, setEditModalOpen] = useState(false);

	const likedCommentDocRef = doc(db, "commentLikes", auth.currentUser.uid);

	const dislikedCommentDocRef = doc(
		db,
		"commentDislikes",
		auth.currentUser.uid
	);

	useEffect(() => {
		getDocs(collection(db, "commentLikes")).then((res) => {
			res.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.id) {
					setLikedCommentsDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		getDocs(collection(db, "commentDislikes")).then((res) => {
			res.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.id) {
					setdislikedCommentsDoc(doc.data());
				}
			});
		});
	}, []);

	let openEditModal = async (e) => {
		e.preventDefault();
		setEditModalOpen(!editModalOpen);
	};

	let closeEditModal = async (e) => {
		e.preventDefault();
		setEditModalOpen(false);

		let { comment } = Object.fromEntries([...new FormData(e.target)]);

		await updateDoc(doc(db, "comments", commentID), {
			comment,
			createdAt: serverTimestamp(),
		});
	};

	let deleteComment = async (e) => {
		e.preventDefault();
		await deleteDoc(doc(db, "comments", commentID));
	};

	let addLike = (e) => {
		e.preventDefault();

		setDoc(
			likedCommentDocRef,
			{
				[commentID]: true,
			},
			{ merge: true }
		);

		updateDoc(doc(db, "comments", commentID), {
			likes: likes + 1,
		});
	};

	let removeLike = (e) => {
		e.preventDefault();

		updateDoc(likedCommentDocRef, {
			[commentID]: deleteField(),
		});

		updateDoc(doc(db, "comments", commentID), {
			likes: likes - 1,
		});
	};

	let addDislike = (e) => {
		e.preventDefault();

		setDoc(
			dislikedCommentDocRef,
			{
				[commentID]: true,
			},
			{ merge: true }
		);

		updateDoc(doc(db, "comments", commentID), {
			dislikes: dislikes + 1,
		});
	};

	let removeDislike = (e) => {
		e.preventDefault();

		updateDoc(dislikedCommentDocRef, {
			[commentID]: deleteField(),
		});

		updateDoc(doc(db, "comments", commentID), {
			dislikes: dislikes - 1,
		});
	};

	return (
		<div className="comment_cont">
			<div className="comment_top_cont">
				<div className="comment_user_avatar_cont">
					<img src={userAvatar} alt="" />
				</div>

				<div className="comment_user_name_cont">
					<span>{userName}</span>
				</div>
			</div>

			<div className="comment_middle_cont">
				{editModalOpen ? (
					<form onSubmit={closeEditModal} action="">
						<textarea
							placeholder="Your comment"
							name="comment"
							id=""
							cols="30"
							rows="10"
							defaultValue={comment}
						></textarea>
						<input type="submit" value="Save" />
					</form>
				) : (
					<span>{comment}</span>
				)}
			</div>

			<div className="comment_bottom_cont">
				<div className="comment_created_at_cont">
					<span>{createdAt?.toDate().toString().slice(4, 21)}</span>
				</div>

				{auth.currentUser.uid === userID ? (
					<div className="comment_edit_delete_cont">
						<div
							onClick={openEditModal}
							className="comment_edit_cont"
						>
							<AiOutlineEdit />
						</div>
						<div
							onClick={deleteComment}
							className="comment_delete_cont"
						>
							<AiOutlineDelete />
						</div>
					</div>
				) : (
					<div className="comment_likes_dislikes_cont">
						<div className="comment_like_cont">
							<div
								onClick={
									likedCommentsDoc[commentID]
										? removeLike
										: addLike
								}
								className="comment_like_icon_cont"
							>
								<FcLike />
							</div>

							<div className="comment_like_count_cont">
								<span>{likes}</span>
							</div>
						</div>
						<div className="comment_dislike_cont">
							<div
								onClick={
									dislikedCommentsDoc[commentID]
										? removeDislike
										: addDislike
								}
								className="comment_dislike_icon_cont"
							>
								<FcDislike />
							</div>

							<div className="comment_dislike_count_cont">
								<span>{dislikes}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
