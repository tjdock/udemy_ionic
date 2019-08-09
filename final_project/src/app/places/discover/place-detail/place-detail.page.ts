import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController
} from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placesSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        });
    });
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  async onBookPlace() {
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.navigateBack('places/tabs/discover');
    // this.navCtrl.pop();

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        { text: 'Cancel', role: 'destructive' }
      ]
    });

    await actionSheet.present();
  }

  async openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    const modal = await this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    console.log(data.bookingData, role);
    if (role === 'confirm') {
      const loading = await this.loadingCtrl.create({
        message: 'Booking place...'
      });
      await loading.present();

      await this.bookingService
        .addBooking(
          this.place.id,
          this.place.title,
          this.place.imageUrl,
          data.bookingData.firstName,
          data.bookingData.lastName,
          data.bookingData.guestNumber,
          data.bookingData.startDate,
          data.bookingData.endDate
        )
        .toPromise();

      await loading.dismiss();
    }
  }
}
