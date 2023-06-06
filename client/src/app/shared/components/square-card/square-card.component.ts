import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-square-card',
  templateUrl: './square-card.component.html',
  styleUrls: ['./square-card.component.scss']
})
export class SquareCardComponent implements OnInit {

  @Input('item') inmueble: any;
  @Input() showControls: boolean = false;
  @Input() showLikes: boolean = false;
  @Input() isFavorite: boolean = false;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() like = new EventEmitter<string>();
  @Output() view = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    console.log('this.inmueble', this.inmueble)
  }

  deleteInmueble(id: string){
    this.delete.emit(id);
  }

  editInmueble(id: string){
    this.edit.emit(id);
  }

  addFavorite(id: string){
    this.like.emit(id);
  }

}
