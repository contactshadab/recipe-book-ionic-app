import { Recipe } from "../models/recipe";

export class RecipeService {
    
    recipes: Recipe[] = [];

    add(recipe: Recipe){
        this.recipes.push(recipe);
    }

    getAll(){
        return this.recipes.slice();
    }

    get(index: number){
        return this.recipes[index];
    }

    update(index: number, recipe: Recipe){
        this.recipes[index] = recipe;
    }

    delete(index: number){
        this.recipes.splice(index, 1);
    }
}