import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe';
import { RecipePage } from '../recipe/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { SaveLoadOptionsPage } from '../save-load-options/save-load-options';
import { AuthService } from '../../services/auth';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  recipes: Recipe[];

  constructor(private navCtrl: NavController, 
    private recipeService: RecipeService, 
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController){

  }

  ionViewWillEnter(){
    this.recipes = this.recipeService.getAll();
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number){
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent){
    const popover = this.popoverCtrl.create(SaveLoadOptionsPage);
    popover.present({
      ev: event
    })

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    popover.onDidDismiss(data => {
      if(!data)
        return;
        
      if(data.action == 'load'){
        loading.present();
        this.authService.getActiveUser().getIdToken()
          .then((token: string)=> {
            this.recipeService.fetchRecipe(token)
              .subscribe(
                (data) => {
                  loading.dismiss();
                  this.recipes = data;
                },
                error => {
                  loading.dismiss();
                  this.presentAlert(error.message);
                }
              )
          })
          .catch(error => console.log(error.message))
      }else if(data.action == 'save'){
        loading.present();
        this.authService.getActiveUser().getIdToken()
          .then((token: string)=> {
            this.recipeService.saveRecipe(token)
              .subscribe(
                () => {
                  loading.dismiss();
                  console.log('Success')
                },
                error => {
                  loading.dismiss();
                  this.presentAlert(error.message);
                }
              )
          })
          .catch(error => console.log(error.message))
      }
    })
  }

  private presentAlert(message: string){
    this.alertCtrl.create({
      title: 'Some error occured',
      message: message,
      buttons: ['OK']
    }).present();
  }

}
