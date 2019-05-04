import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
// import * as firebase from 'firebase';
import * as firebase from 'firebase';
import { ToastController } from '@ionic/angular';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class CargaArchivoService {

  imagenes: ArchivoSubir[] = [];
  lastKey: string = null;

  constructor(
    private _toastCtrl: ToastController,
    private _afDB: AngularFireDatabase
  ) {
    this.cargarUltimoKey().subscribe( () => {
      this.cargarImagenes();
    });
  }

  cargarUltimoKey() {
    return this._afDB.list('/post', ref => ref.orderByKey().limitToLast(1))
              .valueChanges()
              .map((post: any) => {
                console.log(post);
                this.lastKey = post[0].key;
                this.imagenes.push(post[0]);
              });
  }

  cargarImagenes() {
    return new Promise( (resolve, reject) => {
      this._afDB.list('/post',
      ref => ref.limitToLast(3)
                .orderByKey()
                .endAt(this.lastKey)
      ).valueChanges()
       .subscribe( (posts: any) => {
         posts.pop();

         if ( posts.length === 0) {
            console.log('Ya no hay mas registros');
            resolve (false);
            return;
         }

         this.lastKey = posts[0].key;

         for (let i = posts.length - 1; i >= 0; i--) {
           const post = posts[i];
           this.imagenes.push(post);
         }

         resolve(true);
       });
    });
  }

  cargarImagenFirebase(archivo: ArchivoSubir) {
    const promesa = new Promise((resolve, reject) => {
      this.mostrarToast('Cargando...');

      const storeRef = firebase.storage().ref();
      const nombreArchivo: string = new Date().valueOf().toString();
      const uploadTask: firebase.storage.UploadTask =
        storeRef.child(`img/${nombreArchivo}`)
          .putString(archivo.img, 'base64', { contentType: 'image/jpeg ' });
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => { }, // Saber el porcentaje de bites subidos.
        (err) => {
          console.log('ERROR EN LA CARGA');
          console.log(JSON.stringify(err));
          this.mostrarToast(JSON.stringify(err));
          reject();
        },
        () => {
          // Todo Bien
          console.log('Archivo Subido!');
          this.mostrarToast('Imagen cargada Correctamente!');

          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('file avaliable at ', downloadURL);
            const url = downloadURL;
            this.mostrarToast('url: ' + url);
            this.crearPost(archivo.titulo, url, nombreArchivo);
            resolve();
          });

        }
      );
    });

    return promesa;
  }

  private crearPost(titulo: string, url: string, nombreArchivo: string) {
    const post: ArchivoSubir = {
      titulo: titulo,
      img: url,
      key: nombreArchivo
    };

    console.log(JSON.stringify(post));

    // this._afDB.list('/post').push(post);
    this._afDB.object(`/post/${nombreArchivo}`).update(post);
    this.imagenes.push(post);
    this.mostrarToast('Post Creado!');
  }

  async mostrarToast(msg: string) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

interface ArchivoSubir {
  titulo: string;
  img: string;
  key?: string;
}
