import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  breakpoint: number;

  constructor() { }

  ngOnInit(): void {
    // this.breakpoint = (window.innerWidth <= 450) ? 1 : 6;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : 6;
  }
}
