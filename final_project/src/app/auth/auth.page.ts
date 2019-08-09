import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onLogin() {
    this.isLoading = true;
    this.authService.login();
    const loading = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'logging in...'
    });
    await loading.present();

    await setTimeout(async () => {
      this.isLoading = false;
      await loading.dismiss();
      this.router.navigateByUrl('/places/tabs/discover');
    }, 2000);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLogin) {
    } else {
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
