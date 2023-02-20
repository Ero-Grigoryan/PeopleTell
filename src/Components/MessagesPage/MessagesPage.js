import { useState, useEffect } from "react";
import "./messagesPage.style.scss";

import { BiArrowBack } from "react-icons/bi";

import { Navigate } from "react-router-dom";

import { v4 } from "uuid";

import { auth, db } from "../../FirebaseConfig/fbconfig";
import { collection, onSnapshot, query } from "firebase/firestore";

import UserAccountMessagesPage from "../UserAccountMessagesPage/UserAccountMessagesPage";

const MessagesPage = () => {
	const [chatsDoc, setChatsDoc] = useState([]);
	const [getterChatsDoc, setGetterChatsDoc] = useState([]);
	const [goBack, setGoBack] = useState(false);

	useEffect(() => {
		onSnapshot(query(collection(db, "chatRooms")), (snapshot) => {
			snapshot.docs.forEach((document) => {
				if (auth.currentUser.uid === document.id) {
					setChatsDoc(document.data());
				}
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(query(collection(db, "chatRoomsGetter")), (snapshot) => {
			snapshot.docs.forEach((document) => {
				if (auth.currentUser.uid === document.id) {
					setGetterChatsDoc(document.data());
				}
			});
		});
	}, []);

	let backToUserProfile = () => {
		setGoBack(true);
	};

	return (
		<>
			<div className="messages_page_cont">
				<div className="messages_page_messages_cont">
					<div className="messages_cont_my_chats_heading_cont">
						<div
							onClick={backToUserProfile}
							className="messages_page_go_back_arrow_cont"
						>
							<BiArrowBack />
						</div>

						<div className="messages_page_heading_cont">
							<h2>My Chats</h2>
						</div>
					</div>

					<div className="messages_page_users_cont">
						{Object.keys(chatsDoc).length ||
						Object.keys(getterChatsDoc).length ? (
							Object.entries(chatsDoc).map((elem) => {
								return (
									<UserAccountMessagesPage
										key={v4()}
										userAvatar={elem[1].userAvatar}
										userName={elem[1].userName}
										userSurname={elem[1].userSurname}
										message={elem[1].lastMessage}
										userID={elem[1].userID}
									/>
								);
							})
						) : (
							<div className="no_messages_container">
								<div className="no_messages_heading_container">
									<h2>No Messages</h2>
								</div>
							</div>
						)}

						{chatsDoc[Object.keys(chatsDoc)]?.userID ===
							getterChatsDoc[Object.keys(getterChatsDoc)]
								?.userID ||
							Object.entries(getterChatsDoc).map((elem) => {
								return (
									<UserAccountMessagesPage
										key={v4()}
										userAvatar={elem[1].userAvatar}
										userName={elem[1].userName}
										userSurname={elem[1].userSurname}
										message={elem[1].lastMessage}
										userID={elem[1].userID}
									/>
								);
							})}
					</div>
				</div>
			</div>

			{goBack && <Navigate to={`/UserProfile/${auth.currentUser.uid}`} />}
		</>
	);
};

export default MessagesPage;
