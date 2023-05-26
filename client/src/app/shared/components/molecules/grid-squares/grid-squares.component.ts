import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-grid-squares',
  templateUrl: './grid-squares.component.html',
  styleUrls: ['./grid-squares.component.scss']
})
export class GridSquaresComponent implements OnInit {

  @Input('items') inmuebles: any[] = [];
  @Input() showControls: boolean = false;
  @Input() showLikes: boolean = false;
  @Input() isFavorite: boolean = false;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() like = new EventEmitter<string>();
  @Output() view = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
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
