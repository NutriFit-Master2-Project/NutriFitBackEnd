const db = require("../config/firebaseConfig");

interface DailyEntry {
    calories: number;
    steps: number;
    createdAt?: Date;
    date?: string;
    meals?: Meal[];
}

interface Meal {
    id?: string;
    name: string;
    calories: number;
    quantity: number;
    image_url?: string;
    createdAt: Date;
}

const userDailyEntryService = {
    /**
     * Creates a new daily entry for a user.
     * If the entry already exists for the specified date, it throws an error.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @param {number} [calories=0] - The total calories consumed (default is 0).
     * @param {number} [steps=0] - The total steps taken (default is 0).
     * @returns {Promise<{message: string}>} - A success message.
     */
    async createDailyEntry(
        userId: string,
        date: string,
        calories: number = 0,
        steps: number = 0
    ): Promise<{ message: string }> {
        const entryRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date);

        const entry: DailyEntry = {
            calories,
            steps,
            createdAt: new Date(),
        };

        const entryDoc = await entryRef.get();
        if (entryDoc.exists) {
            throw new Error("Daily entry already exists for this date");
        }

        await entryRef.set(entry);
        return { message: "Daily entry created successfully" };
    },

    /**
     * Retrieves all daily entries for a user.
     * Each entry includes the list of associated meals.
     *
     * @param {string} userId - The user's unique identifier.
     * @returns {Promise<DailyEntry[]>} - A list of daily entries.
     */
    async getDailyEntries(userId: string): Promise<DailyEntry[]> {
        const entriesSnapshot = await db.collection("users").doc(userId).collection("dailyEntries").get();

        const entries: DailyEntry[] = [];
        for (const doc of entriesSnapshot.docs) {
            const mealsSnapshot = await db
                .collection("users")
                .doc(userId)
                .collection("dailyEntries")
                .doc(doc.id)
                .collection("meals")
                .get();

            const meals: Meal[] = [];
            mealsSnapshot.forEach((mealDoc: any) => {
                meals.push({
                    id: mealDoc.id,
                    ...(mealDoc.data() as Meal),
                });
            });

            entries.push({
                ...(doc.data() as DailyEntry),
                date: doc.id,
                meals,
            });
        }

        return entries;
    },

    /**
     * Retrieves a specific daily entry by date for a user.
     * If the entry does not exist, it creates a new one with default values.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @returns {Promise<DailyEntry>} - The daily entry with meals.
     */
    async getDailyEntry(userId: string, date: string): Promise<DailyEntry> {
        const entryRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date);
        const entryDoc = await entryRef.get();

        if (!entryDoc.exists) {
            await this.createDailyEntry(userId, date);

            return {
                calories: 0,
                steps: 0,
                meals: [],
                date,
            };
        }

        const mealsSnapshot = await entryRef.collection("meals").get();
        const meals: Meal[] = [];
        mealsSnapshot.forEach((mealDoc: any) => {
            meals.push(mealDoc.data() as Meal);
        });

        return {
            ...(entryDoc.data() as DailyEntry),
            date,
            meals,
        };
    },

    /**
     * Updates an existing daily entry with new data.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @param {Partial<DailyEntry>} data - The fields to update in the daily entry.
     * @returns {Promise<{message: string}>} - A success message.
     */
    async updateDailyEntry(userId: string, date: string, data: Partial<DailyEntry>): Promise<{ message: string }> {
        const entryRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date);

        const entryDoc = await entryRef.get();
        if (!entryDoc.exists) {
            throw new Error("Daily entry not found for the given date");
        }

        await entryRef.update(data);
        return { message: "Daily entry updated successfully" };
    },

    /**
     * Deletes a specific daily entry for a user.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @returns {Promise<{message: string}>} - A success message.
     */
    async deleteDailyEntry(userId: string, date: string): Promise<{ message: string }> {
        const entryRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date);

        await entryRef.delete();
        return { message: "Daily entry deleted successfully" };
    },

    /**
     * Adds a new meal to a specific daily entry.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @param {Meal} meal - The meal to add.
     * @returns {Promise<{message: string}>} - A success message.
     */
    async addMealToEntry(userId: string, date: string, meal: Meal): Promise<{ message: string }> {
        const mealsRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date).collection("meals");

        await mealsRef.add({
            name: meal.name,
            calories: meal.calories,
            quantity: meal.quantity,
            image_url: meal.image_url,
            createdAt: new Date(),
        });

        return { message: "Meal added successfully" };
    },

    /**
     * Retrieves all meals for a specific daily entry.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @returns {Promise<Meal[]>} - A list of meals for the entry.
     */
    async getMealsForEntry(userId: string, date: string): Promise<Meal[]> {
        const mealsRef = db.collection("users").doc(userId).collection("dailyEntries").doc(date).collection("meals");
        const mealsSnapshot = await mealsRef.get();

        const meals: Meal[] = [];
        mealsSnapshot.forEach((doc: any) => {
            meals.push({
                id: doc.id,
                ...(doc.data() as Meal),
            });
        });

        return meals;
    },

    /**
     * Deletes a specific meal from a daily entry.
     *
     * @param {string} userId - The user's unique identifier.
     * @param {string} date - The date of the daily entry in `YYYY-MM-DD` format.
     * @param {string} mealId - The unique identifier of the meal.
     * @returns {Promise<{message: string}>} - A success message.
     */
    async deleteMeal(userId: string, date: string, mealId: string): Promise<{ message: string }> {
        const mealRef = db
            .collection("users")
            .doc(userId)
            .collection("dailyEntries")
            .doc(date)
            .collection("meals")
            .doc(mealId);
        await mealRef.delete();
        return { message: "Meal deleted successfully" };
    },
};

module.exports = { userDailyEntryService };
