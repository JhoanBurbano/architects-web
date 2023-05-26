import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss']
})
export class BandComponent implements OnInit {

  @Input() title = ""
  @Input() borderRadius: boolean = false;
  @Input() showButton: boolean = false;
  @Output() buttonClick = new EventEmitter()


  constructor() { }

  ngOnInit(): void {
  }


  onClick(){
    this.buttonClick.emit()
  }

}
