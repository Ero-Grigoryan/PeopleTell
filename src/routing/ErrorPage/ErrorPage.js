import React from "react";
import "./errorPage.style.scss";

import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
	let error = useRouteError();

	return (
		<div className="error_page_container">
			<div className="error_page_top_container">
				<h2>Oops!</h2>
			</div>

			<div className="error_page_middle_cont">
				<span>Sorry, an unexpected error has occured.</span>
			</div>

			<div className="error_page_bottom_cont">
				<strong>{error.statusText || error.message}</strong>
			</div>
		</div>
	);
};

export default ErrorPage;
