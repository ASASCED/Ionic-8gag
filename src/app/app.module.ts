import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

// FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Camera } from '@ionic-native/camera/ngx';

export const firebaseConfig = {
  apiKey: 'AIzaSyD9z2dsdAwfupe7cSiNq1U_ZwACmCx7C-M',
  authDomain: 'gag-81d62.firebaseapp.com',
  databaseURL: 'https://gag-81d62.firebaseio.com',
  projectId: 'gag-81d62',
  storageBucket: 'gag-81d62.appspot.com',
  messagingSenderId: '946052199301'
};

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SubirPage } from './pages/subir/subir.page';
import { PlaceholderPipe } from './pipes/placeholder.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SubirPage,
    PlaceholderPipe
  ],
  entryComponents: [
    SubirPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireDatabase,
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
