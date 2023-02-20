import * as Yup from "yup";

export let basicSchema = Yup.object().shape({
	Name: Yup.string("The name you entered is invalid").required(
		"Please enter your name"
	),
	Surname: Yup.string("The surname you entered is invalid").required(
		"Please enter your surname"
	),
	Email: Yup.string("The email you entered is invalid")
		.email("Enter a valid Email")
		.required("Please enter your email"),
	Password: Yup.string("The password you entered is invalid")
		.required("Please enter your password")
		.min(6, "Minimum length of password should be 6 characters"),
});
