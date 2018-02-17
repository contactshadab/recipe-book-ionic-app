import { Recipe } from "../models/recipe";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth";
import 'rxjs/Rx';

@Injectable()
export class RecipeService {
    
    constructor(private http: HttpClient, private authService: AuthService){}

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

    saveRecipe(token: string){
        let uid = this.authService.getActiveUser().uid;
        return this.http.put('https://recipe-book-ionic-app-6f891.firebaseio.com/' + uid + '/recipes.json?auth=' + token
            , this.recipes);
    }

    fetchRecipe(token: string){
        let uid = this.authService.getActiveUser().uid;
        return this.http.get<Recipe[]>('https://recipe-book-ionic-app-6f891.firebaseio.com/' + uid + '/recipes.json?auth=' + token)
            .do((data) => {
                this.recipes = data;
            })
    }
}