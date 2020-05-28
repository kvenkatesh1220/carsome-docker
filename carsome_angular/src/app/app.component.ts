import { Component } from '@angular/core';
import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'carsome';
  datetots: any = '';
  minDate: any = '';
  selctedDaySlot: any;
  alert = '';
  constructor(private slotService: RestService) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }
  getSlots(date){
    this.slotService.getSlots(date).subscribe((data) => {
      this.selctedDaySlot = data;
    });
  }
  onDateSelect(e) {
    const month = e.month < 10 ? '0' + e.month : e.month;
    const day = e.day < 10 ? '0' + e.day : e.day;
    this.datetots = `${e.year}-${month}-${day}`;
    this.getSlots(this.datetots);
  }
  reserveSlot(slot, date) {
    const reservedSlot = { ...slot };
    reservedSlot.status = 1;
    reservedSlot.date = date;
    this.slotService.bookSlot(reservedSlot).subscribe((data) => {
      console.log(data['message']);
      this.alert = data['message'];
      this.getSlots(date);
    });
  }
}
