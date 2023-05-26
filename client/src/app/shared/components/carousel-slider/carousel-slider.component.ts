import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel-slider',
  templateUrl: './carousel-slider.component.html',
  styleUrls: ['./carousel-slider.component.scss']
})
export class CarouselSliderComponent {
  @Input('images') set setImages(value: string[]){
    this.images = value,
    this.currentImage = value[0]
  }
  public currentImage!: string;
  public images!: string[];
}
