import * as Yup from "yup";

export let editSchema = Yup.object().shape({
	Name: Yup.string("The name you entered is invalid").required(
		"Please enter your name"
	),
	Surname: Yup.string("The surname you entered is invalid").required(
		"Please enter your surname"
	),
	Username: Yup.string("The username you entered is invalid").required(
		"Please enter your username"
	),
	Email: Yup.string("The email you entered is invalid")
		.email("Enter a valid Email")
		.required("Please enter your email"),
});
