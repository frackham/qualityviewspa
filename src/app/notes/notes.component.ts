// import {SelectionModel} from '@angular/cdk/collections';
// import {FlatTreeControl} from '@angular/cdk/tree';
import {OnInit, Component, Injectable, SimpleChanges, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { tempnote } from '../model/tempnote';
// import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
// import {BehaviorSubject} from 'rxjs';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']

})

export class NotesComponent implements OnInit {
  @ViewChild('agGridNote') agGridNote!: AgGridAngular;
  private gridApi_Note: any;
  private gridColumnApi_Note: any;

  currentId: number = 0;
  dataLoaded: string[] = [];
  defaultColDef: any;

  notes: tempnote[] = [];
  noteColumnDefs: any[] = [];
  noteRowData: any[] = [];

  changelog: any;

  constructor( public apiService: ApiService) {
    this.prepareGrids();
    this.preloadData();

  }

  prepareGrids() {
    this.defaultColDef = {
        resizable: true,
    };

    this.noteColumnDefs = [
      { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, resizable: false, width:130 },
      { headerName: 'Todo?', field: 'todo', sortable: true, editable:true, filter: true, resizable: false, width:130},
      { headerName: 'Note', field: 'text', sortable: true, filter: 'agTextColumnFilter', editable:true, width: 800}
    ];


  }

  onGridAdd_Note(){
    // console.log(this.noteRowData[0]);
    console.log(this.noteRowData);

    var id = this.currentId === 0
      ? Math.max.apply(Math, this.noteRowData.map(function(o) { return o.id; }))
      : this.currentId;
    id ++;

    //New data is added to an array, even if 1 row.
    var newData =
      {
        "id": id,
        "text": "lorem ipsum",
        "todo": true
      }
    ;
    var res = this.gridApi_Note.applyTransaction({
      add: [newData],
      addIndex: id,
    });

    try {
      this.apiService.createNote(newData);
      this.currentId = id;
    } catch {
      throw `Failed to write changes to new note ${newData}.`;
    }
  }


  onGridDelete_IsDisabled_Note(){
    if(!this.gridApi_Note) { return true; }
    return this.gridApi_Note.getSelectedRows().length == 0;
  }

  onGridDelete_Note(e: Event){
    var selectedNotes = this.gridApi_Note.getSelectedRows();

    selectedNotes.forEach((row: any) => {
      var id = row.id;
      this.apiService.deleteNote(id).subscribe((res: {}) => {
        try {
          var response = res;


          this.noteRowData = this.notes;
          this.gridApi_Note.sizeColumnsToFit();
        } catch {
          throw `Failed to delete note of id ${id}`;
        }
      });
    });

  }

  onCellValueChanged_Note(params: any) {
    var changedData:any = [params.data];
    params.api.applyTransaction({ update: changedData });

    var apiObject = changedData[0];
    try {
      this.apiService.postSingleNote(apiObject.id, apiObject);
    } catch {
      throw `Failed to write changes to note ${changedData}, ${apiObject}`;
    }
  }


  onGridReady_Note(params: any) {
    this.gridApi_Note = params.api;
    this.gridColumnApi_Note = params.columnApi;
  }


  ngOnChanges(changes: SimpleChanges): void{
    console.log('OnChanges');
    console.log(JSON.stringify(changes));

    // tslint:disable-next-line:forin
    for (const propName in changes) {
         const change = changes[propName];
         const to  = JSON.stringify(change.currentValue);
         const from = JSON.stringify(change.previousValue);
         const changeLog = `${propName}: changed from ${from} to ${to} `;
         this.changelog.push(changeLog);
    }
}

  ngOnInit(): void {


  }


  preloadData(){
    this.apiService.getNotes(0).subscribe((res: {}) => {
      try {
        this.notes = <tempnote[]>res;
        this.dataLoaded.push('notes');
        console.log('APIExplorer: notes loaded');
        console.log(this.notes);

        this.noteRowData = this.notes;
        this.gridApi_Note.sizeColumnsToFit();
      } catch {
        throw "Failed to retrieve notes";
      }
    });




  }
}


