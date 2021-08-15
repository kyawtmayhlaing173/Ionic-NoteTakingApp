import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertController, PopoverController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { UserService } from '../services/user.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  eventSource = [];
  viewTitle: string;
  username: any;
  enableAddEvent = true;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  selectedDate: Date;

  // @ViewChild(CalendarComponent) myCal: CalendarComponent;
  constructor(
    private alertCtrl: AlertController,
    private storage: Storage,
    private user: UserService,
    public popoverController: PopoverController,
  ) { }

  ionViewWillEnter() {
    this.getCalendarEvent();
    this.getUserName();
  }

  getUserName() {
    this.user.getUserName().then((data) => {
      this.username = data;
    });
  }

  ngOnInit() {
  }

  getCalendarEvent() {
    console.log('Get Calendar Event');
    let events = [];
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('user').doc(data.id).collection('events').get().then((snap) => {
        snap.forEach((doc) => {
          events.push({
            title: doc.data().title,
            startTime: doc.data().startTime.toDate(),
            endTime: doc.data().endTime.toDate(),
            allDay: doc.data().allDay,
          });
          this.eventSource = events;
          console.log(this.eventSource);
        });
      });
    });
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    console.log('View Title Change', title);
    if (title.includes(',')) {
      this.enableAddEvent = true;
    } else {
      this.enableAddEvent = false;
    }
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', 'en');
    let end = formatDate(event.endTime, 'medium', 'en');

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK'],
    });
    alert.present();
  }

  removeEvents() {
    this.eventSource = [];
    this.storage.get('userData').then((data) => {
      let eventQuery = firebase.firestore().collection('user').doc(data.id).collection('events');
      eventQuery.get().then((snap) => {
        snap.forEach((doc) => {
          eventQuery.doc(doc.id).delete();
        })
      });
    });
  }

  createRandomEvents(title) {
    var events = [];
    var date = this.selectedDate;
    var eventType = Math.floor(Math.random() * 2);
    var startTime;
    var endTime;
    startTime = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      )
    );
    endTime = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + 1
      )
    );
    events.push({
      title,
      startTime: startTime,
      endTime: endTime,
      allDay: true,
    });
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('user').doc(data.id).collection('events').add({
        title,
        startTime: startTime,
        endTime: endTime,
        allDay: true,
      });
    });
    this.eventSource = events;
    console.log(this.eventSource);
  }

  onCurrentDateChanged(event: Date) {
    console.log(event);
    this.selectedDate = event;
  }

  async showPrompt() {
    let prompt = await this.alertCtrl.create({
      message: "Enter Event Title",
      cssClass: "prompt-css",
      mode: "ios",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked', data.title);
            this.createRandomEvents(data.title);
          }
        }
      ]
    });
    await prompt.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover-css',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
