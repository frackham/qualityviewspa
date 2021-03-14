import { Injectable, SimpleChanges } from '@angular/core';

//Json sources:

import { environment } from 'src/environments/environment';
// import * as qvResults from 'src/data/example/current/qvResults.json';
import { Dimension } from '../model/dimension';
import { Evidence } from '../model/evidence';
import { Project } from '../model/project';
import { Result } from '../model/result';
// import * from '../../data/example/current/qvResults.json'

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  //Use http://json2ts.com/ to create models from json files.
  dataLoaded: boolean = false
  useDynamicImport:boolean = false;

  dimensions:Dimension[] = [];
  evidence:Evidence[] = [];
  project:Project = {projectName: '', elements:[], relationships:[], subProjects:[], tempElementScoreScale:0};
  subProjects:any[] = []; //TODO: Need a model.
  results:Result[] = [];
  dataSelectorName: string = "";

  constructor() {
    if(environment.consoleDebugValues){
      console.log('JsonDataService:CTOR');
    }
    this.dataSelectorName = '' + environment.dataSource; // Dynamic import() has to be sure that it will be a string, so can have no completely dynamic elements. Hence the leading '', if you remove this it will fail!
    this.loadData();
  }

  async staticImporter(){

    if(environment.consoleDebugValues){
      console.log('JsonDataService:static import');
      console.log('FETCH check');
    }
    var qvSubProjects = '../../data/youth-card/qvSubProjects.json'
    fetch(qvSubProjects)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        this.subProjects = data.subProjects;
        // console.log('subproj:', this.subProjects)
      })
      .catch(err => console.error(err));

    var qvEvidence = '../../data/youth-card/qvEvidence.json'
    fetch(qvEvidence)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        this.evidence = data.evidence;
        // console.log('evidence:', this.evidence)
      })
      .catch(err => console.error(err));

    var qvDimensions = '../../data/youth-card/qvDimensions.json'
    fetch(qvDimensions)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        this.dimensions = data.dimensions;
        // console.log('dimensions:', this.dimensions)
      })
      .catch(err => console.error(err));

    var qvProject = '../../data/youth-card/qvProject.json'
    fetch(qvProject)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        this.project = data.project;
        // this.elements = data.Project.Elements;
        // console.log('proj:', this.project)
      })
      .catch(err => console.error(err));

    var qvResults = '../../data/youth-card/qvResults.json'
    fetch(qvResults)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        this.results = data.results;
        // console.log('results:', this.results)
      })
      .catch(err => console.error(err));

  }

  dynamicImporter(){
    console.log('JsonDataService:dynamic import');
    import('../../data/' + this.dataSelectorName + '/qvResults.json').then(qvResults => {
      this.results = qvResults.results;
    });
    // console.log(this.results);
    import('../../data/' + this.dataSelectorName + '/qvDimensions.json').then(qvDimensions => {
      this.dimensions = qvDimensions.dimensions;
    });
    import('../../data/' + this.dataSelectorName + '/qvEvidence.json').then(qvEvidence => {
      this.evidence = qvEvidence.evidence;
    });
    import('../../data/' + this.dataSelectorName + '/qvProject.json').then(qvProject => {
      this.project = qvProject.project;
    });
    import('../../data/' + this.dataSelectorName + '/qvSubProjects.json').then(qvSubProjects => {
      this.subProjects = qvSubProjects.subProjects;
    });
  }

  loadData() {

    if(environment.consoleDebugValues){
      console.log('JsonDataService:loadData');
      console.log('loadData:start', this.dataLoaded);
    }

    if(this.useDynamicImport) { this.dynamicImporter(); } else { this.staticImporter(); }

    if(environment.consoleDebugValues){
      var outcome = "Data load called: ";
      outcome += "\r\n - Project: " + this.project;
      outcome += "\r\n - SubProjects: " + this.subProjects.length;
      outcome += "\r\n - Project Elements: " + this.project.elements.length;
      outcome += "\r\n - Results: " + this.results.length;
      outcome += "\r\n - Dimensions: " + this.dimensions.length;
      console.log(outcome);
      // this.results.length
      if (this.project.elements.length > 0){
        this.dataLoaded = true;
      }
    }


    if(environment.consoleDebugValues){
      console.log('loadData:end', this.dataLoaded);
    }
  }



  ngOnInit(): void {
    if(environment.consoleDebugValues){
      console.log('JsonDataService:ngOnInit');
      (<any>window).globalDebugData_project = this.project;
      (<any>window).globalDebugData_subprojects = this.subProjects;
      (<any>window).globalDebugData_elements = this.project.elements;
      (<any>window).globalDebugData_dimensions = this.dimensions;
      (<any>window).globalDebugData_results = this.results;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.refresh();
  }

  refresh(){
    if(!this.dataLoaded) {
      this.loadData();
    }
  }


}
