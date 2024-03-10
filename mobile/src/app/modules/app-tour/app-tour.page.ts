import { Component, OnInit } from '@angular/core';
import { BasePage } from '../universal/base.page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-app-tour',
  templateUrl: './app-tour.page.html',
  styleUrls: ['./app-tour.page.scss'],
})
export class AppTourPage extends BasePage implements OnInit {


  constructor(
    private location: Location
  ) {
    super();
  }

  ngOnInit() {
    ''
  }

  async onSkipTourCLicked() {
    await this.appSettingSvc.putAppTourSkipped(true)
    this.location.back();
  }

}
