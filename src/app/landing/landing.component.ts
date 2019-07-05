import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit {

  public fadeContainer: Element = null;

  constructor(private router: Router) {}

  public ngOnInit() {
    this.fadeContainer = document.getElementById('fade-container');
  }

  public ngAfterViewInit() {
    this.fadeContainer.className = 'visible';
  }

  public navigate(route) {
    this.fadeContainer.className = 'hidden';
    setTimeout(() => {
      this.router.navigate([route]).then();
    }, 300);
  }

}


