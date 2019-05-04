import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubirPage } from '../subir/subir.page';
import { CargaArchivoService } from '../../services/carga-archivo.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // posts: Observable<any[]>;
  masElementos: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
    private _cap: CargaArchivoService,
    private _socialSh: SocialSharing
    // private _afDB: AngularFireDatabase
  ) {
    // this.posts = this._afDB.list('post').valueChanges();
  }

  ngOnInit() {
  }

  compartir(post) {
    this._socialSh.shareViaFacebook(post.titulo, null, post.img).then(() => {
      console.log('Compartiendo...');
    }).catch((err) => {
      console.log('Error dentro de compartir: ' + JSON.stringify(err));
    });
  }

  async mostrarModal() {
    const modal = await this._modalCtrl.create({
      component: SubirPage
    });

    await modal.present();
  }

  loadData(event) {
    this._cap.cargarImagenes().then((masElementos: boolean) => {
      console.log(masElementos);
      this.masElementos = !masElementos;
      event.target.complete();
    });
  }

}
