import { useState, useEffect } from "react";
import "./main.style.scss";

import { auth } from "../../FirebaseConfig/fbconfig";

import Header from "../Header/Header";
import LoadingPage from "../LoadingPage/LoadingPage";

const Main = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		auth.onAuthStateChanged(() => {
			setTimeout(() => {
				setIsLoading(false);
			}, 600);
		});
	}, [isLoading]);

	return (
		<>
			{isLoading && <LoadingPage />}
			<div className="main_top_cont">
				<div className="mtc_header_cont">
					<Header />
				</div>

				<div className="mtc_middle_text">
					<h2>
						Share with your life storys with "PeopleTell" <br />
					</h2>
				</div>
			</div>
		</>
	);
};

export default Main;
