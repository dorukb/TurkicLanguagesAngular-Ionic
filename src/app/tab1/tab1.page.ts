import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SearchPage } from "../search/search.page";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  constructor(public modalCtrl: ModalController, private router: Router) {}

  public label: string = "";

  public nativeLanguage: string = "";
  public contributionLanguage: string = "";
  public showProfScale: boolean = false;

  public genders = ["Male", "Female", "Other"];
  private languages = ["Turkish", "Swiss German", "English", "German"];

  async OpenSelect(param: number) {
    var titleText = "";
    if (param == 0) {
      titleText = "Choose your native language";
    } else {
      titleText = "Choose language of contribution";
    }
    const modal = await this.modalCtrl.create({
      component: SearchPage,
      componentProps: {
        data: this.languages,
        titleText: titleText,
      },
    });
    modal.onDidDismiss().then((data) => {
      const language = data["data"]; // selected item

      if (language != undefined && language != "") {
        if (param == 0) {
          this.nativeLanguage = language;
        } else if (param == 1) {
          this.contributionLanguage = language;
        }
        this.updateProficency();
      }
    });

    return await modal.present();
  }

  updateProficency() {
    if (this.nativeLanguage != "" && this.contributionLanguage != "") {
      this.showProfScale = this.nativeLanguage != this.contributionLanguage;
    }
  }
  public async processForm(event) {
    console.log(event);
  }

  onFormSubmit() {
    console.log(this.nativeLanguage, this.contributionLanguage);
    if (this.nativeLanguage.length > 0 && this.contributionLanguage.length > 0) {
      this.router.navigateByUrl("/tabs/tab2");
    }
  }
}
