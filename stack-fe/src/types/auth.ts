// third-party
import firebase from "firebase/compat/app";

// project imports
export type FirebaseContextType = {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null | undefined;
	logout: () => Promise<void>;
	login: () => void;
	firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
	firebaseEmailPasswordSignIn: (email: string, password: string) => void;
	firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
	resetPassword: (email: string) => Promise<void>;
	updateProfile: VoidFunction;
};
export type UserProfile = {
	_id: string;
	displayName: string;
	email: string;
	phone: string;
	avatar: string;
	lang: string;
	currency: string;
	token: string | null;
};

export type JWTContextType = {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null;
	logout: (userId: string) => void;
	login: (email: string, password: string) => void;
};

export interface InitialLoginContextProps {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null;
}
