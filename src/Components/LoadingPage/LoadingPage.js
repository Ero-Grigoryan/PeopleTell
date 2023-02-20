import React from "react";
import "./loadingPage.style.scss";

import { AiOutlineLoading } from "react-icons/ai";

const LoadingPage = () => {
	return (
		<div className="loading_page_container">
			<div className="loading_page_loading_spinner_cont">
				<AiOutlineLoading />
			</div>

			<div className="loading_page_loading_text_container">
				<span>Please wait your page is loading!</span>
			</div>
		</div>
	);
};

export default LoadingPage;
