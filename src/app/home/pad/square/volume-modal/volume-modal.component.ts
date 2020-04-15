import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-volume-modal',
  templateUrl: './volume-modal.component.html',
  styleUrls: ['./volume-modal.component.css']
})
export class VolumeModalComponent implements OnInit {
  map: Object;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
