import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { debug } from 'util';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {

  titleText: string = "";
  searchText: string = "";
  selectedText: string = "";

  items: string[];
  filterItems: string[];

  selectedItems: any[] = [];

  ngOnInit() {}


  constructor(public navParams: NavParams, public modalCtrl: ModalController, public changeDetector: ChangeDetectorRef) {
    this.items = this.navParams.get("data");
    this.titleText = this.navParams.get("titleText");
    this.filterItems = this.items;
  }

  filterList() {
    this.filterItems = this.items;

    if (this.searchText.trim() !== '') {
      console.log('filtering, query is: ', this.searchText, " filter array: ", this.filterItems.length);
      this.filterItems = this.items.filter((item) => {
        return this.startsWith(this.searchText.toLowerCase(), item.toLowerCase());
      });
    }
    this.changeDetector.markForCheck();
  }

  startsWith(sequence: string, ourWord: string): boolean {
    if (sequence.length > ourWord.length) return false;

    for (let i = 0; i < sequence.length; i++) {
      if (ourWord[i] != sequence[i]) {
        return false;
      }
    }
    return true;
  }

  select(item: any) {
    this.searchText = item;
    this.selectedText = item;
    this.closeModal();
  }

  closeModal() {
    console.log("closed modal");
    this.modalCtrl.dismiss(this.selectedText);
  }


}
