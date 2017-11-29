import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'jr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  frontendJRPath: string;

  constructor() {
    const locationOrigin = window.location.origin;
    this.frontendJRPath = locationOrigin + '/2016-11-08-boeken';
  }

}