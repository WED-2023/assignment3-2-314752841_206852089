const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id, showInstructions=false) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree} = recipe_info.data;
    
    let instructions_data = recipe_info.data.instructions;

    console.log(recipe_info.data);

    if (showInstructions && instructions_data) {
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions_data
        }
    }
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree    
    }
}

async function searchByQuery(query, number) {
    results = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: query,
            number: number,
            apiKey: process.env.spooncular_apiKey,
            addRecipeInstructions: true
        }
    });

    // get details for each result
    let recipes_info = await Promise.all(
      results.data.results.map(async (recipe) => {
        return await getRecipeDetails(recipe.id, showInstructions=true);
      })
    );

    return recipes_info;
}

async function getRecipesPreview(recipes_id_array) {
    let recipes_info = await Promise.all(
      recipes_id_array.map(async (id) => {
        return await getRecipeDetails(id);
      })
    );

    return recipes_info;
}

exports.getRecipeDetails = getRecipeDetails;
exports.searchByQuery = searchByQuery;
exports.getRecipesPreview = getRecipesPreview;



