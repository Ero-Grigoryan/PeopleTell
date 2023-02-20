import { useState, useEffect } from "react";
import "./chatRoom.style.scss";

import { AiOutlineDelete } from "react-icons/ai";

import { Link, Navigate, useLocation } from "react-router-dom";

import { v4 } from "uuid";

import { auth, db } from "../../FirebaseConfig/fbconfig";
import {
	addDoc,
	collection,
	deleteField,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";

import Message from "../Message/Message";

const ChatRoom = () => {
	const [userDoc, setUserDoc] = useState([]);
	const [currentUserDoc, setCurrentUserDoc] = useState([]);
	const [messageDoc, setMessageDoc] = useState([]);
	const [message, setMessage] = useState("");
	const [deleted, setDeleted] = useState(false);

	const { pathname } = useLocation();

	const pathUserID = pathname.split("/")[3];

	useEffect(() => {
		onSnapshot(
			query(collection(db, "messagesDoc"), orderBy("createdAt")),
			(snapshot) => {
				let messageArr = [];
				snapshot.docs.forEach((document) => {
					if (
						(auth.currentUser.uid === document.data().senderID &&
							pathUserID === document.data().getterID) ||
						(auth.currentUser.uid === document.data().getterID &&
							pathUserID === document.data().senderID)
					) {
						messageArr.push(document.data());
					}
				});

				setMessageDoc(messageArr);
			}
		);
	}, []);

	useEffect(() => {
		getDocs(collection(db, "users")).then((res) => {
			res.docs.forEach((document) => {
				if (auth.currentUser.uid === document.data().userID) {
					setCurrentUserDoc(document.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		getDocs(collection(db, "users")).then((res) => {
			res.docs.forEach((document) => {
				if (pathUserID === document.data().userID) {
					setUserDoc(document.data());
				}
			});
		});
	}, []);

	let sendMessage = async (e) => {
		e.preventDefault();
		setMessage("");

		let { message } = Object.fromEntries([...new FormData(e.target)]);

		await addDoc(collection(db, "messagesDoc"), {
			message,
			senderID: auth.currentUser.uid,
			getterID: pathUserID,
			createdAt: serverTimestamp(),
			userAvatar: currentUserDoc.Avatar,
			userName: userDoc.Name,
			userSurname: userDoc.Surname,
		}).then((ref) => {
			updateDoc(doc(db, "messagesDoc", ref.id), {
				messageID: ref.id,
			});
		});

		await setDoc(
			doc(db, "chatRooms", auth.currentUser.uid),
			{
				[userDoc.userID]: {
					lastMessage: message,
					userAvatar: userDoc.Avatar,
					userName: userDoc.Name,
					userSurname: userDoc.Surname,
					userID: userDoc.userID,
				},
			},
			{ merge: true }
		);

		await setDoc(
			doc(db, "chatRoomsGetter", userDoc.userID),
			{
				[auth.currentUser.uid]: {
					lastMessage: message,
					userAvatar: currentUserDoc.Avatar,
					userName: currentUserDoc.Name,
					userSurname: currentUserDoc.Surname,
					userID: currentUserDoc.userID,
				},
			},
			{ merge: true }
		);
	};

	let deleteChat = async () => {
		setDeleted(true);

		await updateDoc(doc(db, "chatRooms", currentUserDoc.userID), {
			[userDoc.userID]: deleteField(),
		});
	};

	return (
		<>
			<div className="chat_room_cont">
				<div className="chat_cont">
					<div className="chat_room_top_cont">
						<div className="chat_room_top_user_avatar_name_cont">
							<div className="chat_room_top_user_avatar_cont">
								<img src={userDoc.Avatar} alt="" />
							</div>

							<div className="chat_room_top_user_name_cont">
								<Link to={`/UserProfile/${pathUserID}`}>
									{userDoc.Name + " " + userDoc.Surname}
								</Link>
							</div>
						</div>

						<div
							onClick={deleteChat}
							className="chat_room_top_delete_chat_cont"
						>
							<AiOutlineDelete />
						</div>
					</div>

					<div className="chat_room_bottom_cont">
						<div className="chat_room_bottom_messages_cont">
							{messageDoc.map(
								({
									message,
									userAvatar,
									senderID,
									messageID,
									getterID,
									userName,
									userSurname,
								}) => {
									return (
										<Message
											key={v4()}
											messageID={messageID}
											message={message}
											userAvatar={userAvatar}
											senderID={senderID}
											getterID={getterID}
											userName={userName}
											userSurname={userSurname}
										/>
									);
								}
							)}
						</div>

						<div className="chat_room_bottom_send_message_cont">
							<form onSubmit={sendMessage} action="">
								<input
									placeholder="Enter your message"
									onChange={(e) => {
										setMessage(e.target.value);
									}}
									name="message"
									value={message}
									type="text"
								/>
								<input type="submit" value="Send" />
							</form>
						</div>
					</div>
				</div>
			</div>

			{deleted && (
				<Navigate
					to={`/UserProfile/${auth.currentUser.uid}/Messages`}
				/>
			)}
		</>
	);
};

export default ChatRoom;
