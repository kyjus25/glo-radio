import {Routes} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {NewComponent} from './new/new.component';
import {ExistingComponent} from './existing/existing.component';
import {PlayerComponent} from './player/player.component';

export const appRoutes
: Routes = [
    {path: 'landing', component: LandingComponent},
    {path: 'new', component: NewComponent},
    {path: 'existing', component: ExistingComponent},
    {path: 'player', component: PlayerComponent},
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {path: '**', redirectTo: 'landing', pathMatch: 'full'},
];
