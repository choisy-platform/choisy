import { Component, OnInit } from '@angular/core';
import { NgxPubSubService } from '../universal/pub-sub';
import { AppConstant } from '../universal/app-constant';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  constructor(
    private pubsubSvc: NgxPubSubService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    'hello';
  }

  async toggleLanguage(language: string) {
    await this.modalCtrl.dismiss(language);
  }
}
