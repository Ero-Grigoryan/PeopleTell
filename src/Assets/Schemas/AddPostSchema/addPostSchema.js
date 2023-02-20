import * as Yup from "yup";

export let addPostSchema = Yup.object().shape({
	postTitle: Yup.string("Enter a valid title").required("No title"),
	postContent: Yup.string("Enter a valid content").required("No content"),
	postType: Yup.string("Enter a valid type").required("No type"),
	readingTime: Yup.number("Enter a valid time").required(
		"Enter a reading time"
	),
	readingTimeValue: Yup.string().required(),
});
