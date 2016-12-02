import {Component} from "@angular/core";
import {DatabaseService} from "../../providers";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addMessage: string = '';
  getMessage: string = '';
  removeMessage: string = '';

  constructor(public databaseService: DatabaseService) {
  }

  add() {
    this.databaseService.addShoppingItem('milk', 2)
      .then(success => {
        if (success) {
          this.addMessage = 'Milk saved successfully';
        } else {
          this.addMessage = 'Error in saving milk';
        }
      });
  }

  get() {
    this.databaseService.getShoppingItem('milk')
      .then(data => {
        if (data) {
          this.getMessage = 'Milk Object from database > ' + JSON.stringify(data);
        } else {
          this.getMessage = 'Error in getting milk';
        }
      });
  }

  remove() {
    this.databaseService.removeShoppingItem('milk')
      .then(success => {
        if (success) {
          this.removeMessage = 'Milk removed successfully';
        } else {
          this.removeMessage = 'Error in removing milk';
        }
      });
  }


}
