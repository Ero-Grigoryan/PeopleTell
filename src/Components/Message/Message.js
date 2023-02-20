import { useEffect, useRef, useState } from "react";
import "./message.style.scss";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import { auth, db } from "../../FirebaseConfig/fbconfig";
import {
	deleteDoc,
	deleteField,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";

const Message = ({
	messageID,
	message,
	userAvatar,
	senderID,
	getterID,
	userName,
	userSurname,
}) => {
	const [chatRoomsDoc, setChatRoomsDoc] = useState([]);
	const [chatRoomsGetterDoc, setChatRoomsGetterDoc] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const messageContRef = useRef(null);

	useEffect(() => {
		getDoc(doc(db, "chatRooms", auth.currentUser.uid)).then((document) => {
			setChatRoomsDoc(document.data());
		});
	}, []);

	useEffect(() => {
		getDoc(doc(db, "chatRoomsGetter", getterID)).then((document) => {
			setChatRoomsGetterDoc(document.data());
		});
	}, []);

	useEffect(() => {
		messageContRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [modalOpen]);

	useEffect(() => {
		messageContRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	let deleteMessage = async () => {
		await deleteDoc(doc(db, "messagesDoc", messageID));

		chatRoomsDoc[getterID]?.lastMessage === message &&
			(await updateDoc(doc(db, "chatRooms", auth.currentUser.uid), {
				[getterID]: deleteField(),
			}));

		chatRoomsGetterDoc[senderID]?.lastMessage === message &&
			(await updateDoc(doc(db, "chatRoomsGetter", getterID), {
				[senderID]: deleteField(),
			}));
	};

	let openEditModal = () => {
		setEditModalOpen(!editModalOpen);
	};

	let editMessage = async (e) => {
		e.preventDefault();

		setEditModalOpen(false);

		let { msg } = Object.fromEntries([...new FormData(e.target)]);

		await updateDoc(doc(db, "messagesDoc", messageID), {
			message: msg,
		});

		chatRoomsDoc[getterID]?.lastMessage === message &&
			(await updateDoc(doc(db, "chatRooms", auth.currentUser.uid), {
				[getterID]: {
					userAvatar,
					userID: getterID,
					userName: userName,
					userSurname,
					lastMessage: msg,
				},
			}));

		chatRoomsGetterDoc[senderID]?.lastMessage === message &&
			(await updateDoc(doc(db, "chatRoomsGetter", getterID), {
				[senderID]: {
					userAvatar,
					userID: senderID,
					userName: userName,
					userSurname,
					lastMessage: msg,
				},
			}));
	};

	let openModal = () => {
		if (senderID === auth.currentUser.uid) {
			setModalOpen(!modalOpen);
		}
	};

	return (
		<>
			<div
				ref={messageContRef}
				onClick={openModal}
				className="message_cont"
			>
				<div className="message_user_avatar_cont">
					<img src={userAvatar} alt="" />
				</div>

				<div
					className={
						senderID === auth.currentUser.uid
							? "message_text_cont owner"
							: "message_text_cont"
					}
				>
					{editModalOpen ? (
						<form onSubmit={editMessage} action="">
							<textarea
								placeholder="Message"
								defaultValue={message}
								name="msg"
								id=""
								cols="30"
								rows="10"
							></textarea>
							<input type="submit" value="Save" />
						</form>
					) : (
						<span>{message}</span>
					)}
				</div>
			</div>

			{modalOpen && (
				<div className="message_delete_edit_cont">
					<div
						onClick={deleteMessage}
						className="message_delete_cont"
					>
						<AiOutlineDelete />
					</div>

					<div onClick={openEditModal} className="message_edit_cont">
						<AiOutlineEdit />
					</div>
				</div>
			)}
		</>
	);
};

export default Message;
