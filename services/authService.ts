import { User } from "../models/user.model";

const firebaseDb = require("../config/firebaseConfig");
const bcrypt = require("bcryptjs");

/**
 * Checks if an email is already present in the "users" collection
 * @param email - The email to check
 * @returns - True if the email is already present, otherwise false
 */
const isEmailAlreadyInDb = async (email: string): Promise<boolean> => {
    try {
        const usersRef = firebaseDb.collection("users");
        const query = usersRef.where("email", "==", email);
        const snapshot = await query.get();

        return !snapshot.empty;
    } catch (error) {
        throw new Error("Error while checking email existence");
    }
};

/**
 * Finds a user by his email
 * @param email - The email of the user to search for
 * @returns - The user data if found, otherwise null
 */
const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const usersRef = firebaseDb.collection("users");
        const query = usersRef.where("email", "==", email);
        const snapshot = await query.get();

        if (snapshot.empty) {
            return null; // No user found
        }

        const userDoc = snapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw new Error("Error finding user by email");
    }
};

/**
 * Creates a new user and hashes his password
 * @param name - The name of the user
 * @param email - The email of the user
 * @param rowPassword - The plain-text password of the user
 * @returns - The ID of the created user
 */
const createUser = async (name: string, email: string, rowPassword: string) => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rowPassword, salt);

    const docRef = await firebaseDb.collection("users").add({ name, email, hashedPassword });
    return docRef.id;
};

/**
 * Fetches all users from the "users" collection
 * @returns - An array of user objects
 */
const fetchAllUsers = async () => {
    const usersRef = firebaseDb.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
        return []; // No users found
    }

    let users: any[] = [];
    snapshot.forEach((doc: any) => {
        users.push({ id: doc.id, ...doc.data() });
    });
    return users;
};

module.exports = {
    isEmailAlreadyInDb,
    findUserByEmail,
    createUser,
    fetchAllUsers,
};
