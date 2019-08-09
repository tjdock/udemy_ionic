import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }
  ngOnDestroy() {
    console.log('destroy');
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
  async onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    const loading = await this.loadingCtrl.create({
      message: 'Cancelling...'
    });
    await loading.present();
    await this.bookingService.cancelBooking(bookingId).toPromise();
    await loading.dismiss();
  }
}
