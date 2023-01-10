// Food recipes API needed data
var appId = '6f5c4ad2';
var appKey = 'c7a0e5796e069dc7440036cfc09db2d8';

// Grab DOM needed elements
var searchInput = $('#search-input');
var searchBtn = $('#search-button');
var searchHistory = $('#history');
var clearBtn = $('#clear-btn');
var recipeWrapper = $('#food-drink-recipes');
var dropdownMenu = $('.dropdown-menu');
var recipe = '';
var recipeType = '';
var length = 0;

// Function to start searching for recipes
function startSearch() {
    $('.form').removeClass('hide');
}
$('#start-search').click(startSearch);

// Function to change input placeholder based on recipe type 
function changePlaceholder() {
    recipeType = $(".recipe_choice:checked").val();
    if (recipeType === 'Drink') {
        searchInput.attr('placeholder', 'Margarita')
    } else {
        searchInput.attr('placeholder', 'Cheesecake')
    }
}
$(".recipe_choice").click(changePlaceholder);

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
    displayPreviousSearches();
}

// Food recipes API
function displayFoodRecipes(foodName) {
    recipeWrapper.html('');

    $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}&q=${foodName}`)
        .then(function (data) {
            console.log(data);
            if (data.count === 0) {length = null};
            if(searchInput.val() !== ''){
                addRecipe();
            };

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
            if (data.drinks === null) {length = null};
            if(searchInput.val() !== ''){
                addRecipe();
            };
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

// Save recipe to localStorage
function getSearchedRecipes() {
    return JSON.parse(localStorage.getItem('previousSearches')) || [];
}

function saveRecipe(arr) {
    localStorage.setItem('previousSearches', JSON.stringify(arr));
}

function displayPreviousSearches() {
    var previousSearches = getSearchedRecipes();
    console.log(previousSearches);
    dropdownMenu.html('');

    // Display the history dropdown menu button only if the recipes array is not empty
    if (previousSearches.length > 0) {
        $('.history-list').removeClass('hide');
    }
    previousSearches.forEach(function (recipe) {
        console.log(recipe);
        dropdownMenu.append(`
        <li><a class="dropdown-item previous-${recipe.type}" href="#">${recipe.recipe.charAt(0).toUpperCase() + recipe.recipe.slice(1)}</a></li>
        `)
    })
    dropdownMenu.append(`
        <li><hr class="dropdown-divider"></li>
        <li><a id="clear-history" class="dropdown-item" href="#">Clear search history</a></li>
    `)
}

function addRecipe() {

        var previousSearches = getSearchedRecipes();
        var previousRecipe = {
            recipe: searchInput.val().toLowerCase(),
            type: $(".recipe_choice:checked").val().toLowerCase()
        }

        // If there is no recipe input or the entered recipe is already saved to localStorage -> skip it
            if (previousSearches.includes(previousRecipe)) {return}
        //if(length !== null){
                previousSearches.push(previousRecipe);
                saveRecipe(previousSearches);
        //}
        searchInput.val('');

        displayPreviousSearches();
}

// Function to get recipes from dropdown menu history ?
function getFromHistory(event) {
    console.log(event);
    console.log(event.target.innerText.toLowerCase());
    var previousRecipe = event.target.innerText.toLowerCase();
    // Run the code ONLY IF list element clicked includes the class .previous-dish or .previous-drink
    if (event.target.className.includes('previous-dish')) {
        console.log(previousRecipe);
        displayFoodRecipes(previousRecipe);
        $('.form').removeClass('hide');
    }
    else if (event.target.className.includes('previous-drink')) {
        console.log(previousRecipe);
        displayDrinkRecipes(previousRecipe);
        $('.form').removeClass('hide');
    }
    // Otherwise clear recipes search history  
    else {
        localStorage.clear();
        // Remove injected HTML with previously saved rcipes
        dropdownMenu.html('');
        // Hide dropdown menu
        $('.history-list').addClass('hide');
        // Show search input  
        $('.form').removeClass('hide');
    }
}
dropdownMenu.delegate('li', 'click', getFromHistory);

function init() {
    searchBtn.click(getRecipe);
    //searchBtn.click(addRecipe);
    displayPreviousSearches();
}

init();