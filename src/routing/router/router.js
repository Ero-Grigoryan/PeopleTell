import { createBrowserRouter } from "react-router-dom";

import Main from "../../Components/Main/Main";
import SignUp from "../../Components/SignUp/SignUp";
import SignIn from "../../Components/SignIn/SignIn";
import UserProfile from "../../Components/UserProfile/UserProfile";
import EditProfile from "../../Components/EditProfile/EditProfile";
import Saved from "../../Components/Saved/Saved";
import MessagesPage from "../../Components/MessagesPage/MessagesPage";
import ErrorPage from "../ErrorPage/ErrorPage";
import Contact from "../../Components/Contact/Contact";
import About from "../../Components/About/About";
import Post from "../../Components/Post/Post";
import Blog from "../../Components/Blog/Blog";
import FollowersPage from "../../Components/FollowersPage/FollowersPage";
import FollowingPage from "../../Components/FollowingPage/FollowingPage";
import ChatRoom from "../../Components/ChatRoom/ChatRoom";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Main />,
		errorElement: <ErrorPage />,
	},

	{
		path: "About",
		element: <About />,
	},

	{
		path: "Blog",
		element: <Blog />,
	},

	{
		path: "Contact",
		element: <Contact />,
	},

	{
		path: "SignUp",
		element: <SignUp />,
	},

	{
		path: "SignIn",
		element: <SignIn />,
	},

	{
		path: "UserProfile/:userID",
		element: <UserProfile />,
	},

	{
		path: "/UserProfile/:userID/Followers",
		element: <FollowersPage />,
	},

	{
		path: "/UserProfile/:userID/Following",
		element: <FollowingPage />,
	},

	{
		path: "EditProfile",
		element: <EditProfile />,
	},

	{
		path: "/UserProfile/:userID/Messages",
		element: <MessagesPage />,
	},

	{
		path: "UserProfile/Archive",
		element: "",
	},

	{
		path: "UserProfile/Saved",
		element: <Saved />,
	},

	{
		path: "/post/*",
		element: <Post />,
	},

	{
		path: "/UserProfile/Messages/:userID",
		element: <ChatRoom />,
	},
]);
