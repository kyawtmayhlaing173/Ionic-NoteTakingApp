import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
    private user: UserService,
    private navCtrl: NavController,
    private popOver: PopoverController
  ) { }

  ngOnInit() { }

  logout() {
    this.user.logOut();
    this.popOver.dismiss();
  }
}
