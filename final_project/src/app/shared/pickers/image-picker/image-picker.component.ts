import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: true }) filePicker: ElementRef<
    HTMLInputElement
  >;
  selectedImage: string;
  @Output() imagePick = new EventEmitter<string>();
  userPicker = false;
  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('mobile,', this.platform.is('mobile'));
    console.log('hybird,', this.platform.is('hybird'));
    console.log('ios,', this.platform.is('ios'));
    console.log('android,', this.platform.is('android'));
    console.log('desktop,', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybird')) ||
      this.platform.is('desktop')
    ) {
      this.userPicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.userPicker) {
      this.filePicker.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = image.base64String;
        this.imagePick.emit(image.base64String);
      })
      .catch(error => {
        console.log('ERROR', error);
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };
    fr.readAsDataURL(pickedFile);
  }
}
