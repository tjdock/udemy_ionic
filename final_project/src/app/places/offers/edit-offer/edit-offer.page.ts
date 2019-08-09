import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  private placesSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occurred',
                message: 'Place could not be fetched',
                buttons: [{ text: 'OK', handler: () => {} }]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  async onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Updating place...'
    });
    await loading.present();

    await this.placeService
      .updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      )
      .toPromise();

    await loading.dismiss();
    await this.form.reset();
    await this.router.navigateByUrl('/places/tabs/offers');
  }
}
