import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingrediant';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  ingredients: Ingredient[];

  constructor(private shopListService: ShoppingListService){
  }

  ionViewWillEnter(){
    this.loadIngredients();
  }

  onSubmit(form: NgForm){
    this.shopListService.addIngredient(form.value);
    form.reset();
    this.loadIngredients();
  }

  loadIngredients(){
    this.ingredients = this.shopListService.getAll();
  }

  onClickIngredient(position: number){
    this.shopListService.removeItem(position);
    this.loadIngredients();
  }
 

}
