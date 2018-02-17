import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import firebase from 'firebase';
import { AuthService } from '../services/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  tabsPage:any = TabsPage;
  signInPage: any = SigninPage;
  signUpPage: any = SignupPage;
  isAuthenticated: boolean = false;

  @ViewChild('myNav') nav: NavController;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private menuCtrl: MenuController,
    private authService: AuthService) {
    

    firebase.initializeApp({
      apiKey: "AIzaSyAfKUxqKz42E4UzefTw2VFmVSjAP06iwmQ",
      authDomain: "recipe-book-ionic-app-6f891.firebaseapp.com"
    });

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.isAuthenticated = true;
        this.nav.setRoot(this.tabsPage);
      }else {
        this.isAuthenticated = false;
        this.nav.setRoot(this.signInPage);
      }
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout(){
    this.authService.signout();
    this.menuCtrl.close();
  }
}

