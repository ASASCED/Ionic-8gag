import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { CargaArchivoService } from '../../services/carga-archivo.service';

@Component({
  selector: 'app-subir',
  templateUrl: './subir.page.html',
  styleUrls: ['./subir.page.scss'],
})
export class SubirPage implements OnInit {

  titulo: string = '';
  imagenPreview: string = '';
  imagen64: string;

  constructor(
    private _modalCtrl: ModalController,
    private _camera: Camera,
    private _imagePic: ImagePicker,
    private _cap: CargaArchivoService,
  ) { }

  ngOnInit() {
  }

  salirModal() {
    this._modalCtrl.dismiss();
  }

  mostrarCamara() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE
    };

    this._camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;
    }, (err) => {
      // Handle error
      console.log('Error: ' + JSON.stringify(err));
    });
  }

  seleccionarFoto() {
    const opciones: ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    };
    this._imagePic.getPictures(opciones).then((results) => {
      for (let i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);
        this.imagenPreview = 'data:image/jpeg;base64,' + results[i];
        this.imagen64 = results[i];
      }
    }, (err) => {
      console.log('Error: ' + JSON.stringify(err));
    });
  }

  crearPost() {
    const archivo = {
      img: this.imagen64,
      titulo: this.titulo
    };

    this._cap.cargarImagenFirebase(archivo).then(() => {
      this.salirModal();
    });
  }

}
