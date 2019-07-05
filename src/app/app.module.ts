import {appRoutes} from './routes';
import {LandingComponent} from './landing/landing.component';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {DropdownModule, InputTextModule, ProgressSpinnerModule} from 'primeng/primeng';
import {NewComponent} from './new/new.component';
import {GloSDKModule} from '@kyjus25/glo-rxjs-sdk';
import {ExistingComponent} from './existing/existing.component';
import {PlayerComponent} from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NewComponent,
    ExistingComponent,
    PlayerComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true}),
    BrowserModule,
    GloSDKModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
