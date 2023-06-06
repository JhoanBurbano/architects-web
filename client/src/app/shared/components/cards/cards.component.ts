import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input() card: any;

  constructor() {}
  
  ngOnInit(): void {
    console.log('card', this.card.images[0])
  }

}
