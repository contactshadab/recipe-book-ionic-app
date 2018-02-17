import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingrediant';
import { PopoverController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { SaveLoadOptionsPage } from '../save-load-options/save-load-options';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  ingredients: Ingredient[];

  constructor(private shopListService: ShoppingListService, 
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastctrl: ToastController){
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

  onShowOptions(event: MouseEvent){
    const popover = this.popoverCtrl.create(SaveLoadOptionsPage);
    popover.present({
      ev: event
    });

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    })

    popover.onDidDismiss(data => {
      if(!data)
        return;
        
      if(data.action == 'load'){
        loading.present();
        this.authService.getActiveUser().getIdToken()
          .then((token: string) => {
            this.shopListService.fetchList(token)
              .subscribe(
                (data) => {
                  loading.dismiss();
                  if(data)
                    this.ingredients = data;
                  else
                  this.ingredients = [];
                },
                error => {
                  loading.dismiss();
                  this.presentAlert(error.message);
                }
              );
          })
      }else if(data.action == 'save'){
        loading.present();
        this.authService.getActiveUser().getIdToken()
          .then((token: string) => {
            this.shopListService.storeList(token)
              .subscribe(
                () => {
                  loading.dismiss();
                  this.toastctrl.create({
                    message: 'Data saved successfully',
                    duration: 1500
                  }).present();
                },
                error => {
                  loading.dismiss();
                  this.presentAlert(error.message);
                }
              );
          })
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
