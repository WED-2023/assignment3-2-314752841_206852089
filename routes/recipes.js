var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// router.get("/", (req, res) => {
//    res.sendFile(__dirname + "/recipes.html")
// });


router.get("/search", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.searchByQuery(req.body.query, req.body.number || 5);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
