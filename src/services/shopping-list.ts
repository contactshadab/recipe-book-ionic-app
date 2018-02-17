import { Ingredient } from "../models/ingrediant";
import { HttpClient } from '@angular/common/http';
import { AuthService } from "./auth";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';

@Injectable()
export class ShoppingListService {

    constructor(private http: HttpClient, private authService: AuthService){}

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

    storeList(token: string){
        let uid = this.authService.getActiveUser().uid;
        return this.http.put('https://recipe-book-ionic-app-6f891.firebaseio.com/' + uid + '/shopping-list.json?auth=' + token, 
            this.shoppingList);
    }
    
    fetchList(token: string){
        let uid = this.authService.getActiveUser().uid;
        return this.http.get<Ingredient[]>('https://recipe-book-ionic-app-6f891.firebaseio.com/' + uid + '/shopping-list.json?auth=' + token)
            .do((data) => {
                this.shoppingList = data;
            })
    }
}