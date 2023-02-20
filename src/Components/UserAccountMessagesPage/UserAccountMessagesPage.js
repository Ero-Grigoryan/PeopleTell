import { useState } from "react";
import "./userAccountMessagesPage.style.scss";

import { Navigate } from "react-router-dom";

const UserAccountMessagesPage = ({
	userAvatar,
	userName,
	userSurname,
	message,
	userID,
}) => {
	const [clicked, setClicked] = useState(false);

	let goToChat = () => {
		setClicked(true);
	};

	return (
		<>
			<div onClick={goToChat} className="user_account_messages_page">
				<div className="user_account_messages_page_avatar_cont">
					<img src={userAvatar} alt="" />
				</div>

				<div className="user_account_messages_page_user_name_message_cont">
					<div className="user_account_messages_page_user_name_cont">
						<span>{userName + " " + userSurname}</span>
					</div>

					<div className="user_account_messages_page_user_message_cont">
						<span>{message}</span>
					</div>
				</div>
			</div>

			{clicked && <Navigate to={`/UserProfile/Messages/${userID}`} />}
		</>
	);
};

export default UserAccountMessagesPage;
