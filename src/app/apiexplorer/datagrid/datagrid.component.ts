import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})

export class DatagridComponent<T> implements OnChanges, OnInit {
  @ViewChild('agGridObject') agGridObject!: AgGridAngular;
  @Input()
  modelType!: <T>({ }) => T;
  @Input() nameSingular: string = '';
  @Input() namePlural: string = '';
  @Input() columnDefs: any = null;
  @Input() newObjectTemplate: any = null;

  //required params
  // [x] type <-- or any.
  // [x] name
  // [x] pluralname
  // [x] columndefs
  // [ ] api endpoint: create single
  // [x] api endpoint: update single
  // [x] api endpoint: get data
  // [x] api endpoint: delete

  //new data function?

  private gridApi_Object: any;
  private gridColumnApi_Object: any;

  dataLoaded: string[] = [];

  objectsData: any[] = [];
  objectColumnDefs: any[] = [];
  objectRowData: any[] = [];

  changelog: any = [];
  dirty: boolean;

  constructor(public apiService: ApiService) {
    this.dirty = true;
  }

  initialise(){
    this.prepareGrid();
    this.preloadData();
    this.dirty = false;
  }

  prepareGrid() {
    this.objectColumnDefs = this.columnDefs;
  }

  onGridAdd(){
    // console.log(this.objectRowData[0]);
    console.log(this.objectRowData);

    var id = Math.max.apply(Math, this.objectRowData.map(function(o) { return o.id; }))
    id ++;
    //New data is added to an array, even if 1 row.
    var newData =
      {
        "id": id,
        "name": "New Object",
        "description": "Object Description",
        "isDefault": false,
        "image": "",
        "logo": "",
        "createdOn": new Date,
        "updatedOn": null
      }
    ;
    var res = this.gridApi_Object.applyTransaction({
      add: [newData],
      addIndex: id,
    });

    try {
      this.apiService.createObject(newData, this.nameSingular);
    } catch {
      throw `Failed to write changes to new object ${newData}.`;
    }
  }

  onGridDelete_IsDisabled(){
    if(!this.gridApi_Object) { return true; }
    return this.gridApi_Object.getSelectedRows().length == 0;
  }

  onGridDelete(e: Event){
    var selectedObjects = this.gridApi_Object.getSelectedRows();

    selectedObjects.forEach((row: any) => {
      var id = row.id;
      this.apiService.deleteObject(id, this.nameSingular).subscribe((res: {}) => {
        try {
          var response = res;


          this.objectRowData = this.objectsData;
          this.gridApi_Object.sizeColumnsToFit();

          //Force refresh
          this.initialise();
        } catch {
          throw `Failed to delete object of id ${id}`;
        }
      });
    });
  }


  onCellValueChanged(params: any) {
    var changedData:any = [params.data];
    params.api.applyTransaction({ update: changedData });

    var apiObject = changedData[0];
    try {
      this.apiService.postSingleObject(apiObject.id, apiObject, this.nameSingular);
    } catch {
      throw `Failed to write changes to object ${changedData}, ${apiObject}`;
    }
  }



  onGridReady(params: any) {
    this.gridApi_Object = params.api;
    this.gridColumnApi_Object = params.columnApi;
  }



  ngOnChanges(changes: SimpleChanges): void{
    console.log('OnChanges');
    console.log(JSON.stringify(changes));

    // tslint:disable-next-line:forin
    for (const propName in changes) {
         const change = changes[propName];
         const to  = JSON.stringify(change.currentValue);
         const from = JSON.stringify(change.previousValue);
         const changeLogUpdate = `${propName}: changed from ${from} to ${to} `;
         this.changelog.push(changeLogUpdate);
    }

    //Only load when data is available
    if(this.dirty && this.nameSingular !== '') {
      this.initialise();
    }
}

  ngOnInit(): void {


  }


  preloadData(){
    this.apiService.getObjects(0, this.nameSingular).subscribe((res: any) => {
      try {
        this.objectsData = <any[]>res;
        this.dataLoaded.push('objects');
        console.log('APIExplorer: objects loaded');
        console.log(this.objectsData);

        this.objectRowData = this.objectsData;
        this.gridApi_Object.sizeColumnsToFit();
      } catch {
        throw "Failed to retrieve objects";
      }
    });

  }


}
