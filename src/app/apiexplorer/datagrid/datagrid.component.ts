import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/ui-generic/alert';


@Component({
	selector: 'app-datagrid',
	templateUrl: './datagrid.component.html',
	styleUrls: ['./datagrid.component.scss'],
})

// eslint-disable-next-line no-unused-vars
export class DatagridComponent<T> implements OnChanges, OnInit {
  @ViewChild('agGridObject') agGridObject!: AgGridAngular;
  @Input()
  modelType!: <T>({ }) => T;
  @Input()
  readModelType?: <T>({ }) => T;
  @Input() nameSingular: string = '';
  @Input() namePlural: string = '';
  @Input() columnDefs: any = null;
  @Input() newObjectTemplate: any = null;
  @Input() listFilter: any = null;

  private gridApiObject: any;
  private gridColumnApiObject: any;


  objectsData: any[] = [];
  objectColumnDefs: any[] = [];
  objectRowData: any[] = [];


  alertOptions = {
  	autoClose: true,
  	keepAfterRouteChange: false,
  };
  changelog: any = [];
  dirty: boolean;
  gridVisible: boolean = true;

  constructor(public apiService: ApiService, public alertService: AlertService) {
  	this.dirty = true;
  }

  initialise() {
  	this.prepareGrid();
  	this.preloadData();
  }

  prepareGrid() {
  	this.objectColumnDefs = this.columnDefs;
  }

  onGridAdd($ev:Event) {
  	// Relies on (table having a primary key id called id, and template having an id value.)
  	const newData = this.newObjectTemplate;

  	// eslint-disable-next-line prefer-spread
  	let id = Math.max.apply(Math, this.objectRowData.map(function(o) {
  		return o.id;
  	}));
  	id ++;

  	newData.id = id;

  	let res;

  	try {
  		res = this.gridApiObject.applyTransaction({
  			add: [newData], // New data is added to an array, even if 1 row.
  			addIndex: id,
  		});

  		this.apiService.createObject(newData, this.nameSingular);
  		this.alertService.success(`Success!! ${this.nameSingular} added.`, this.alertOptions);
  		// Trigger refresh after adding object so that deleting same object doesn't throw an error
  		this.refreshGrid(new Event('null'), false);
  	} catch {
  		this.alertService.error(`Failed to add ${this.nameSingular}, ${res}.`, this.alertOptions);
  		throw new Error(`Failed to write changes to new object of type ${this.nameSingular} using: ${newData}.`);
  	}
  }

  refreshGrid($ev:Event, doAlert:boolean = true) {
  	this.alertService.info(`Data refreshed.`, this.alertOptions);
  	this.initialise();
  }

  toggleGrid($ev:Event) {
  	this.gridVisible = !this.gridVisible;
  }

  onGridDeleteIsDisabled() {
  	// TODO: Refactor to avoid warning in console. Seems to be undefined or null, but not caught by checks below?
  	if (this.gridVisible && this.gridApiObject) {
  		if (this.gridApiObject == null) {
  			return true;
  		} // Null or undefined.
  		// console.log(this.gridApi_Object);
  		const rows = this.gridApiObject.getSelectedRows();
  		// console.log(rows);
  		// We can only delete if there are rows and the grid is ready.
  		// Note use of  != null to check for null AND undefined.

  		return rows != null ? rows.length == 0 : true;
  		// If rows are null, return disabled, else if rows have values return enabled.
  	}
  	return true;
  }

  onGridDelete(e: Event) {
  	if (this.gridApiObject) {
  		const selectedObjects = this.gridApiObject.getSelectedRows();

  		selectedObjects.forEach((row: any) => {
  			const id = row.id;
  			this.apiService.deleteObject(id, this.nameSingular).subscribe((res: {}) => {
  				try {
  					// const response = res;


  					this.objectRowData = this.objectsData;
  					this.gridApiObject.sizeColumnsToFit();

  					this.alertService.success(`Success!! ${this.nameSingular} deleted.`, this.alertOptions);
  					// Force refresh
  					this.initialise();
  				} catch {
  					this.alertService.error(`Failed to delete ${this.nameSingular}.`, this.alertOptions);
  					throw new Error(`Failed to delete object of type ${this.nameSingular} using id ${id}`);
  				}
  			});
  		});
  	}
  }


  onCellValueChanged(params: any) {
  	const changedData:any = [params.data];
  	params.api.applyTransaction({ update: changedData });

  	const apiObject = changedData[0];
  	try {
  		this.apiService.postSingleObject(apiObject.id, apiObject, this.nameSingular);

  		this.alertService.success(`Success!! ${this.nameSingular} updated.`, this.alertOptions);
  	} catch {
  		this.alertService.error(`Failed to update ${this.nameSingular}.`, this.alertOptions);
  		throw new Error(
  			`Failed to write changes to object of type ${this.nameSingular} using ${changedData}, ${apiObject}`);
  	}
  }


  onGridReady(params: any) {
  	this.gridApiObject = params.api;
  	this.gridColumnApiObject = params.columnApi;
  	this.initialise();
  }


  ngOnChanges(changes: SimpleChanges): void {
  	// console.log('OnChanges');
  	// console.log(JSON.stringify(changes));

  	for (const propName in changes) {
  		if (Object.prototype.hasOwnProperty.call(changes, propName)) {
  			const change = changes[propName];
  			const to = JSON.stringify(change.currentValue);
  			const from = JSON.stringify(change.previousValue);
  			const changeLogUpdate = `${propName}: changed from ${from} to ${to} `;
  			this.changelog.push(changeLogUpdate);
  		}
  	}

  	// Only load when data is available
  	if (this.dirty && this.nameSingular !== '') {
  		this.initialise();
  	}
  }

  ngOnInit(): void {


  }


  preloadData() {
  	if (this.gridApiObject) {
  		this.apiService.getObjects(0, this.nameSingular, this.listFilter).subscribe((res: any) => {
  			try {
  				this.objectsData = <any[]>res;
  				// console.log(`APIExplorer: objects loaded (${this.nameSingular})`);
  				// console.log(this.objectsData);

  				this.objectRowData = this.objectsData;
  				this.gridApiObject.sizeColumnsToFit();
  				this.dirty = false; // Only is not dirty when data has been successfully loaded AND no changes.
  			} catch {
  				throw new Error(`Failed to retrieve objects of type ${this.nameSingular}`);
  			}
  		});
  	}
  }
}
