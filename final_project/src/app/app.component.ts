import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });

    this.locateUser();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('ERROR LOCATION');
      return;
    }

    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        console.log('lat=', geoPosition.coords.latitude);
        console.log('lng=', geoPosition.coords.longitude);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
}
