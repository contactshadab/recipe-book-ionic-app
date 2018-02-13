import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, AlertController, NavController, ToastController} from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {

  recipeForm: FormGroup;

  mode: string = 'New';
  difficultyOptions = ['Easy', 'Medium', 'Hard'];
  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams, 
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private recipeService: RecipeService,
    private navCtrl: NavController) {
  }

  ngOnInit(){
    this.mode = this.navParams.get('mode');

    if(this.mode == 'Edit'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    this.initializeForm();
  }

  onSubmit(){
    const value = this.recipeForm.value;
    let ingredients = [];
    ingredients = value.ingredients.map(name => {
      return {name: name, amount: 1};
    })
    value.ingredients = ingredients;

    if(this.mode == 'New'){
      this.recipeService.add(value);
    }else{
      this.recipeService.update(this.index, value);
    }
    
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredient(){
    console.log('onManageIngredient');
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Manage Ingredient',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            if((<FormArray>this.recipeForm.get('ingredients')).length > 0){
              for(let i = (<FormArray>this.recipeForm.get('ingredients')).length-1; i >= 0 ; i--)
                (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
              
              //Show toast message
              this.toastCtrl.create({
                message: 'Removed all ingredients',
                duration: 2000,
                position: 'bottom'
              }).present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  private createNewIngredientAlert(){
    return this.alertCtrl.create({
      title: 'New Ingredient',
      inputs: [
        {
          name: 'ingredientName',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            //If data is invalid
            if(data.ingredientName.trim() == '' || data.ingredientName == null){
              this.toastCtrl.create({
                message: 'Ingredient name was not entered.',
                duration: 2000,
                position: 'bottom'
              }).present();
              return;
            }
            //Pushing new FormControl to FormArray
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.ingredientName, Validators.required));
            this.toastCtrl.create({
              message: 'Added ingredient',
              duration: 2000,
              position: 'bottom'
            }).present();
          }
        }
      ]
    });
  }

  private initializeForm(){
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];
    
    if (this.mode == 'Edit'){
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredients){
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
      difficulty: new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

}
