import {Component} from '@angular/core';
import {GloSDK} from '@kyjus25/glo-rxjs-sdk';
const CONFIG = require('@assets/config.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private gloSDK: GloSDK) {
    this.gloSDK.setAccessToken(CONFIG['GITKRAKEN_API_KEY']);
  }
}
