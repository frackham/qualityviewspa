import {OnInit, Component, Injectable, SimpleChanges, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { tempnote } from '../model/tempnote';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']

})

export class NotesComponent implements OnInit {


  noteColumnDefs =  [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, resizable: false, width:130 },
    { headerName: 'Todo?', field: 'todo', sortable: true, editable:true, filter: true, resizable: false, width:130},
    { headerName: 'Note', field: 'text', sortable: true, filter: 'agTextColumnFilter', editable:true, width: 800}
  ];
  noteTemplate = {
      "id": null,
      "text": "lorem ipsum",
      "todo": true
  };
  noteListFilter = {
    "todo": true
  }


  constructor() {


  }
  ngOnInit(): void {
  }

}


