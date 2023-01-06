// Food recipes API needed data
var appId = '6f5c4ad2';
var appKey = 'c7a0e5796e069dc7440036cfc09db2d8';

// Grab DOM needed elements
var searchInput = $('#search-input');
var searchBtn = $('#search-button');
var searchHistory = $('#history');
var clearBtn = $('#clear-btn');
var recipeWrapper = $('#food-drink-recipes');
var recipe = '';
var recipeType = '';

// Function to get user recipe preferences input
function getRecipe(event) {
    // Prevent page from refreshing when clicking on the search button
    event.preventDefault();
    // Get form data: user recipe input & recipe type (e.g: Dish/Drink)
    recipe = searchInput.val().trim();
    // Get the value of the selected radio input
    recipeType = $(".recipe_choice:checked").val();
    if (recipe !== '' && recipeType === 'Dish') {
        displayFoodRecipes(recipe);
    } else if (recipe !== '' && recipeType === 'Drink') {
        displayDrinkRecipes(recipe);
    } else {
        $('#myModal').modal('show');
    }
}

// Food recipes API
function displayFoodRecipes(foodName) {
    recipeWrapper.html('');

    $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}&q=${recipe}`)
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.hits.length; i++) {
                console.log(data.hits[i].recipe.label);
                console.log(data.hits[i].recipe.url);
                recipeWrapper.append(`
                <div class="col-lg-3 col-md-4 col-sm-12">
                        <div class="card mb-3" style="width: 18rem;">
                            <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.hits[i].recipe.label}</h5>
                                <a href="${data.hits[i].recipe.url}" class="btn btn-dark" target="_blank">View recipe</a>
                            </div>
                        </div>
                    </div>
                `)
            }
        })
}

// Cocktails Recipes API
function displayDrinkRecipes(drinkName) {
    recipeWrapper.html('');

    $.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`)
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.drinks.length; i++) {
                console.log(data.drinks[i]);
                console.log(data.drinks[i].strDrink.replace(/\s+/g, '-').replace("'", ''));
                var recipeUrl = 'https://www.thecocktaildb.com/drink/' + data.drinks[i].idDrink + '- ' + data.drinks[i].strDrink.replace(/\s+/g, '-').replace("'", '');
                recipeWrapper.append(`
                <div class="col-lg-3 col-md-4 col-sm-12">
                        <div class="card mb-3" style="width: 18rem;">
                            <img src="${data.drinks[i].strDrinkThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.drinks[i].strDrink}</h5>
                                <a href="${recipeUrl}" class="btn btn-dark" target="_blank">View recipe</a>
                            </div>
                        </div>
                    </div>
                `)
            }
        })
}

function init() {
    searchBtn.click(getRecipe);
}

init();