import { Ingredient } from "../models/ingrediant";

export class ShoppingListService {
    private shoppingList: Ingredient[] = [];

    addIngredient(ingredient: Ingredient){
        this.shoppingList.push(ingredient);
    }

    addMultipleIngredients(ingredients: Ingredient[]){
        this.shoppingList.push(...ingredients);
    }

    getAll(){
        return this.shoppingList.slice();
    }

    removeItem(index: number){
        this.shoppingList.splice(index, 1);
    }
}