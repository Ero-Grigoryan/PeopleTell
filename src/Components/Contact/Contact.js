import { useState } from "react";
import "./contact.style.scss";

import { BiArrowBack } from "react-icons/bi";

import { Navigate } from "react-router-dom";

import { Formik, Field } from "formik";
import { supportMessageSchema } from "../../Assets/Schemas/SupportMessageSchema/supportMessageSchema";

import { db } from "../../FirebaseConfig/fbconfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

const Contact = () => {
	const [submited, setSubmited] = useState(false);
	const [canceled, setCanceled] = useState(false);

	let colRef = collection(db, "supportMessages");

	let handleSubmitForm = async (userInfo) => {
		let { Name, Surname, Email, Message } = userInfo;

		setSubmited(true);
		setTimeout(() => {
			setSubmited(false);
		}, 5000);

		await addDoc(colRef, {
			FirstName: Name,
			LastName: Surname,
			Email: Email,
			Message: Message,
		}).then((messageRef) => {
			updateDoc(doc(db, "supportMessages", messageRef.id), {
				messageID: messageRef.id,
			});
		});
	};

	let backToMain = () => {
		setCanceled(true);
	};

	return (
		<>
			<div className="contact_page_container">
				<div className="contact_page_middle_cont">
					<div className="contact_page_middle_cont_top">
						<div
							onClick={backToMain}
							className="contact_page_back_arrow_cont"
						>
							<BiArrowBack />
						</div>

						<div className="contact_page_heading_cont">
							<h2>Get in touch</h2>
						</div>
					</div>

					<div className="contact_page_middle_cont_bottom">
						<Formik
							initialValues={{
								Name: "",
								Surname: "",
								Email: "",
								Message: "",
							}}
							validationSchema={supportMessageSchema}
							onSubmit={handleSubmitForm}
						>
							{({
								errors,
								touched,
								handleChange,
								handleSubmit,
								values,
							}) => {
								return (
									<form onSubmit={handleSubmit} action="">
										<Field
											name="Name"
											placeholder="Name"
											type="text"
											value={values.Name}
											onChange={handleChange}
											disabled={submited}
										/>

										{errors.Name && touched.Name ? (
											<div className="support_err_cont">
												<span>{errors.Name + "!"}</span>
											</div>
										) : null}

										<Field
											name="Surname"
											placeholder="Surname"
											type="text"
											value={values.Surname}
											onChange={handleChange}
											disabled={submited}
										/>

										{errors.Surname && touched.Surname ? (
											<div className="support_err_cont">
												<span>
													{errors.Surname + "!"}
												</span>
											</div>
										) : null}

										<Field
											name="Email"
											placeholder="Email"
											type="email"
											value={values.Email}
											onChange={handleChange}
											disabled={submited}
										/>

										{errors.Email && touched.Email ? (
											<div className="support_err_cont">
												<span>
													{errors.Email + "!"}
												</span>
											</div>
										) : null}

										<Field
											name="Message"
											placeholder="Message"
											type="text"
											value={values.Message}
											onChange={handleChange}
											disabled={submited}
										/>

										{submited && (
											<div className="support_err_cont">
												<span>Message sended!</span>
											</div>
										)}

										<Field
											name="submit"
											value="Send"
											type="submit"
											disabled={submited}
										/>
									</form>
								);
							}}
						</Formik>
					</div>
				</div>
			</div>

			{canceled && <Navigate to="/" />}
		</>
	);
};

export default Contact;
