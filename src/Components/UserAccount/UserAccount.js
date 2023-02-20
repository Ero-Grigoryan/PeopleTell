import { useState } from "react";
import "./userAccount.style.scss";

import { Navigate } from "react-router-dom";

const UserAccount = ({ userAvatar, userName, userSurname, userID }) => {
	const [clicked, setClicked] = useState(false);

	let goToUserPage = (e) => {
		e.preventDefault();
		setClicked(true);
	};

	return (
		<>
			<div onClick={goToUserPage} className="user_account_cont">
				<div className="user_account_avatar_cont">
					<img src={userAvatar} alt="" />
				</div>

				<div className="user_account_name_cont">
					<span>{userName + " " + userSurname}</span>
				</div>
			</div>
			{clicked && <Navigate to={`/UserProfile/${userID}`} />}
		</>
	);
};

export default UserAccount;
