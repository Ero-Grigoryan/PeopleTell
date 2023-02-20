import { useState, useEffect, useReducer, useRef } from "react";
import "./userProfile.style.scss";

import { BsBookmarkPlus } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { TiPlus, TiMessage } from "react-icons/ti";

import {
	Link,
	NavLink,
	Navigate,
	useLocation,
	useNavigate,
} from "react-router-dom";

import { v4 } from "uuid";

import { Formik, Field } from "formik";
import { addPostSchema } from "../../Assets/Schemas/AddPostSchema/addPostSchema";

import { auth, db, storage } from "../../FirebaseConfig/fbconfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";

import {
	collection,
	addDoc,
	serverTimestamp,
	updateDoc,
	doc,
	onSnapshot,
	query,
	orderBy,
	setDoc,
	deleteField,
} from "firebase/firestore";

import PrevPost from "../PrevPost/PrevPost";
import LoadingPage from "../LoadingPage/LoadingPage";

function reducer(state, action) {
	let { type } = action;

	switch (type) {
		case "messages":
			return {
				messages: true,
				saved: false,
			};

		case "saved":
			return {
				messages: false,
				saved: true,
			};

		default:
			return;
	}
}

const UserProfile = () => {
	const [userDoc, setUserDoc] = useState([]);
	const [currentUserDoc, setCurrentUserDoc] = useState([]);
	const [postDoc, setPostDoc] = useState([]);
	const [followingDoc, setFollowingDoc] = useState([]);
	const [burgerActive, setBurgerActive] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [signedIn, setSignedIn] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const [click, dispatch] = useReducer(reducer, {
		messages: false,
		saved: false,
	});

	const postAddModalRef = useRef(null);

	const navigate = useNavigate();

	const { pathname } = useLocation();
	const pathUserID = pathname.split("/")[2];

	const { messages, saved } = click;

	const usersColRef = collection(db, "users");
	const postsColRef = collection(db, "posts");

	const storageRef = ref(
		storage,
		`gs://peopletell-9532a.appspot.com/postImages/image${v4()}`
	);

	useEffect(() => {
		onSnapshot(
			query(collection(db, "posts"), orderBy("createdAt", "desc")),
			(snapshot) => {
				let postArr = [];
				snapshot.docs.forEach((document) => {
					if (pathUserID === document.data().userID) {
						postArr.push(document.data());
					}
				});

				setPostDoc(postArr);
			}
		);
	}, []);

	useEffect(() => {
		onSnapshot(query(usersColRef), (snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (pathUserID === doc.data().userID) {
					setUserDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(query(usersColRef), (snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.data().userID) {
					setCurrentUserDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(query(collection(db, "followingDoc")), (snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (auth.currentUser.uid === doc.id) {
					setFollowingDoc(doc.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		auth.onAuthStateChanged(() => {
			setTimeout(() => {
				setIsLoading(false);
			}, 1050);
		});
	}, [isLoading]);

	useEffect(() => {
		postAddModalRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [modalOpen]);

	let openBurger = () => {
		setBurgerActive(!burgerActive);
	};

	let openModal = (e) => {
		if (e.target.matches("div")) {
			return;
		}

		setModalOpen(true);
	};

	let signOutUser = async (auth) => {
		setSignedIn(false);
		await signOut(auth);
	};

	let addPost = async ({
		postTitle,
		postContent,
		postImage,
		postType,
		readingTime,
		readingTimeValue,
	}) => {
		setModalOpen(false);

		postImage !== "" &&
			(await uploadBytes(storageRef, postImage).then(() => {}));

		await addDoc(postsColRef, {
			postTitle,
			postContent,
			postImageRef:
				postImage !== ""
					? await getDownloadURL(storageRef).then((url) => {
							return url;
					  })
					: "",
			postType,
			readingTime,
			readingTimeValue,
			userName: auth.currentUser.displayName,
			userID: auth.currentUser.uid,
			userAvatar: userDoc.Avatar,
			createdAt: serverTimestamp(),
			likesCount: 0,
			dislikesCount: 0,
		}).then((docRef) => {
			updateDoc(doc(db, "posts", docRef.id), {
				postID: docRef.id,
			});
		});

		await updateDoc(doc(db, "users", userDoc.userDocumentID), {
			postsCount: userDoc.postsCount + 1,
		});
	};

	let followUser = (e) => {
		e.preventDefault();

		setDoc(
			doc(db, "followingDoc", auth.currentUser.uid),
			{
				[userDoc.userID]: {
					following: true,
					userPhoto: userDoc.Avatar,
					userName: userDoc.Name,
					userSurname: userDoc.Surname,
					userID: userDoc.userID,
				},
			},
			{ merge: true }
		);

		setDoc(
			doc(db, "followersDoc", userDoc.userID),
			{
				[auth.currentUser.uid]: {
					following: true,
					userPhoto: currentUserDoc.Avatar,
					userName: currentUserDoc.Name,
					userSurname: currentUserDoc.Surname,
					userID: currentUserDoc.userID,
				},
			},
			{ merge: true }
		);

		updateDoc(doc(db, "users", currentUserDoc.userDocumentID), {
			followingCount: currentUserDoc.followingCount + 1,
		});

		updateDoc(doc(db, "users", userDoc.userDocumentID), {
			followersCount: userDoc.followersCount + 1,
		});
	};

	let unFollowUser = (e) => {
		e.preventDefault();

		updateDoc(doc(db, "followingDoc", auth.currentUser.uid), {
			[userDoc.userID]: deleteField(),
		});

		updateDoc(doc(db, "followersDoc", userDoc.userID), {
			[auth.currentUser.uid]: deleteField(),
		});

		updateDoc(doc(db, "users", currentUserDoc.userDocumentID), {
			followingCount: currentUserDoc.followingCount - 1,
		});

		updateDoc(doc(db, "users", userDoc.userDocumentID), {
			followersCount: userDoc.followersCount - 1,
		});
	};

	let refreshPage = () => {
		navigate(0);
	};

	let closeModal = (e) => {
		if (e.target.matches("div")) {
			return;
		}

		setModalOpen(false);
	};

	return (
		<>
			<div className="user_profile_cont">
				{isLoading && <LoadingPage />}
				<div className="user_profile_header_cont">
					<header>
						<div className="user_profile_header_left_cont">
							<Link to="/">
								<h1>PeopleTell</h1>
							</Link>
						</div>

						<div
							onClick={openBurger}
							className="user_profile_burger"
						>
							<RxHamburgerMenu />
						</div>
					</header>
				</div>

				{burgerActive && (
					<div className="user_profile_burger_menu">
						<nav className="user_profile_burger_navigation">
							<ul>
								<div
									onClick={refreshPage}
									className="user_profile_burger_nav_account_cont"
								>
									<li>
										<NavLink
											to={`/UserProfile/${auth.currentUser.uid}`}
										>
											<img
												src={auth.currentUser.photoURL}
												alt=""
											/>
										</NavLink>
									</li>
								</div>

								<div
									onClick={() => {
										dispatch({
											type: "messages",
										});
									}}
									className="user_profile_burger_nav_messages_cont"
								>
									<div className="user_profile_burger_messages_icon_cont">
										<TiMessage />
									</div>

									<div className="user_profile_burger_messages_heading_cont">
										<li>
											<button>Chats</button>
										</li>
									</div>
								</div>

								<div
									onClick={() => {
										dispatch({ type: "saved" });
									}}
									className="user_profile_burger_nav_saved_cont"
								>
									<div className="user_profile_burger_saved_icon_cont">
										<BsBookmarkPlus />
									</div>

									<div className="user_profile_burger_saved_heading_cont">
										<li>
											<button>Saved</button>
										</li>
									</div>
								</div>
							</ul>
						</nav>
					</div>
				)}

				<div
					style={{ backgroundImage: "" }}
					className="user_profile_top_cont"
				>
					<div className="user_top_avatar_cont">
						{auth.currentUser && (
							<img src={userDoc.Avatar} alt="" />
						)}
					</div>

					<div className="user_top_name_cont">
						<span>{userDoc.Name + " " + userDoc.Surname}</span>
					</div>

					<div className="user_top_profile_link_cont">
						<Link>{userDoc.userName}</Link>
					</div>

					{userDoc.Bio !== "" ? (
						<div className="user_top_description_cont">
							<p>{userDoc.Bio}</p>
						</div>
					) : null}

					<div className="user_top_posts_followers_following_count_container">
						<div className="user_top_posts_cont">
							<div className="user_top_posts_heading_cont">
								<a target="_self" href="#user_profile_main">
									Posts
								</a>
							</div>

							<div className="user_top_posts_count_cont">
								<span>{userDoc.postsCount}</span>
							</div>
						</div>

						<div className="user_top_followers_cont">
							<div className="user_top_followers_heading_cont">
								<Link
									to={`/UserProfile/${pathUserID}/Followers`}
								>
									Followers
								</Link>
							</div>

							<div className="user_top_followers_count_cont">
								<span>{userDoc.followersCount}</span>
							</div>
						</div>

						<div className="user_top_following_cont">
							<div className="user_top_following_heading_cont">
								<Link
									to={`/UserProfile/${pathUserID}/Following`}
								>
									Following
								</Link>
							</div>

							<div className="user_top_following_count_cont">
								<span>{userDoc.followingCount}</span>
							</div>
						</div>
					</div>

					<div className="user_top_follow_button_cont">
						{pathUserID === auth.currentUser?.uid ? (
							<Link to="/EditProfile">
								<button>Edit</button>
							</Link>
						) : (
							<button
								onClick={
									followingDoc[userDoc.userID]
										? unFollowUser
										: followUser
								}
							>
								{followingDoc[userDoc.userID]
									? "Unfollow"
									: "Follow"}
							</button>
						)}
					</div>

					{pathUserID === auth.currentUser?.uid ? (
						<div className="user_top_sign_out_cont">
							<button onClick={() => signOutUser(auth)}>
								Sign Out
							</button>
						</div>
					) : (
						<div className="user_profile_send_message_button_cont">
							<Link to={`/UserProfile/Messages/${pathUserID}`}>
								Message
							</Link>
						</div>
					)}
				</div>

				<div className="user_profile_bottom_cont">
					{pathUserID === auth.currentUser?.uid ? (
						<div onClick={openModal} className="add_post_cont">
							<TiPlus />
							<span>Add a new post</span>
						</div>
					) : null}

					{postDoc.length || modalOpen ? (
						<main id="user_profile_main">
							{modalOpen && (
								<div
									ref={postAddModalRef}
									className="post_add_modal_connt"
								>
									<Formik
										initialValues={{
											postTitle: "",
											postContent: "",
											postImage: "",
											postType: "",
											readingTime: "",
											readingTimeValue: "Minutes",
										}}
										validationSchema={addPostSchema}
										onSubmit={addPost}
									>
										{({
											errors,
											touched,
											handleChange,
											handleSubmit,
											setFieldValue,
											values,
										}) => {
											return (
												<form
													onSubmit={handleSubmit}
													action=""
												>
													<Field
														name="postTitle"
														placeholder="Enter a title"
														onChange={handleChange}
														value={values.postTitle}
														className={
															errors.postTitle &&
															touched.postTitle
																? "post_add_error"
																: ""
														}
														type="text"
													/>

													<Field
														as="textarea"
														name="postContent"
														id=""
														cols="30"
														rows="10"
														onChange={handleChange}
														value={
															values.postContent
														}
														className={
															errors.postContent &&
															touched.postContent
																? "post_add_error"
																: ""
														}
														placeholder="Enter a content"
													></Field>

													<Field
														name="postImage"
														onChange={(e) => {
															setFieldValue(
																"postImage",
																e.target
																	.files[0]
															);
														}}
														value={""}
														type="file"
													/>

													<div className="add_post_post_type_read_time_cont">
														<div className="add_post_post_type_cont">
															<Field
																name="postType"
																placeholder="Post type"
																onChange={
																	handleChange
																}
																value={
																	values.postType
																}
																className={
																	errors.postType &&
																	touched.postType
																		? "post_add_error"
																		: ""
																}
																type="text"
															/>
														</div>

														<div className="add_post_read_time_cont">
															<Field
																name="readingTime"
																placeholder="Reading time"
																onChange={
																	handleChange
																}
																value={
																	values.readingTime
																}
																className={
																	errors.readingTime &&
																	touched.readingTime
																		? "post_add_error"
																		: ""
																}
																type="number"
															/>

															<Field
																as="select"
																name="readingTimeValue"
																onChange={
																	handleChange
																}
																value={
																	values.readingTimeValue
																}
																className={
																	errors.readingTimeValue &&
																	touched.readingTimeValue
																		? "post_add_error"
																		: ""
																}
																id=""
															>
																<option value="minutes">
																	Minutes
																</option>

																<option value="hours">
																	Hours
																</option>
															</Field>
														</div>
													</div>

													<Field
														type="submit"
														name="addPostSubmit"
														value="Add post"
													/>
												</form>
											);
										}}
									</Formik>

									<div className="post_add_cancel_button_cont">
										<button onClick={closeModal}>
											Cancel
										</button>
									</div>
								</div>
							)}

							{postDoc.length
								? postDoc.map(
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
													readingTimeValue={
														readingTimeValue
													}
													createdAt={createdAt}
													userID={userID}
													userName={userName}
													userAvatar={userAvatar}
													userDoc={userDoc}
												/>
											);
										}
								  )
								: null}
						</main>
					) : null}
				</div>

				{signedIn || <Navigate to="/" />}
				{messages && (
					<Navigate
						to={`/UserProfile/${auth.currentUser.uid}/Messages`}
					/>
				)}
				{saved && <Navigate to="/UserProfile/Saved" />}
			</div>
		</>
	);
};

export default UserProfile;
