import * as Yup from "yup";

export let supportMessageSchema = Yup.object().shape({
	Name: Yup.string("Enter a valid name").required("Please enter your name"),
	Surname: Yup.string("Enter a valid surname").required(
		"Please enter your surname"
	),
	Email: Yup.string("The email you entered is invalid")
		.email("Enter a valid email")
		.required("Please enter your email"),
});
