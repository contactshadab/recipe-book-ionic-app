import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Recipe } from '../../models/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipeService } from '../../services/recipe';
import { ShoppingListService } from '../../services/shopping-list';
import { ShoppingListPage } from '../shopping-list/shopping-list';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {

  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams, 
    private navCtrl: NavController,
    private recipeService: RecipeService,
    private shoppingService: ShoppingListService) {
  }

  ngOnInit(){
    this.index = this.navParams.get('index');
    this.recipe = this.navParams.get('recipe');
  }

  onEditRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index})
  }

  onDeleteRecipe(){
    this.recipeService.delete(this.index);
    this.navCtrl.popToRoot();
  }

  onAddIngredientToShop(){
    this.shoppingService.addMultipleIngredients(this.recipe.ingredients);
  }

}
