import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './components/cards/cards.component';
import { SquareCardComponent } from './components/square-card/square-card.component';
import { BandComponent } from './components/band/band.component';
import { GridSquaresComponent } from './components/molecules/grid-squares/grid-squares.component';
import { CarouselSliderComponent } from './components/carousel-slider/carousel-slider.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    CardsComponent,
    SquareCardComponent,
    BandComponent,
    GridSquaresComponent,
    CarouselSliderComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardsComponent,
    SquareCardComponent,
    BandComponent,
    GridSquaresComponent,
    CarouselSliderComponent,
    MatSnackBarModule,
  ]
})
export class SharedModule { }
