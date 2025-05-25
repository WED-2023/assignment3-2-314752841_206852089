const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    // Check if the recipe is already marked as favorite
    const existing_favorite = await DButils.execQuery(`SELECT * FROM favorites WHERE user_id='${user_id}' AND recipe_id=${recipe_id}`);
    if (existing_favorite.length > 0) {
        throw { status: 409, message: "Recipe is already marked as favorite" };
    }

    await DButils.execQuery(`INSERT INTO favorites VALUES ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favorites WHERE user_id='${user_id}'`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
