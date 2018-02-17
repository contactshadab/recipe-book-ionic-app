import { Component } from "@angular/core";
import { ViewController } from "ionic-angular/navigation/view-controller";


@Component({
    selector: 'page-sl-options',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col><h3>Save/Load List</h3></ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <button ion-button outline (click)="onAction('load')">Load List</button>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <button ion-button outline (click)="onAction('save')">Save List</button>
                </ion-col>
            </ion-row>
        </ion-grid>

    `
})
export class SaveLoadOptionsPage {

    constructor(private viewCtrl: ViewController){}

    onAction(action: string) {
        this.viewCtrl.dismiss({action: action});
    }

}