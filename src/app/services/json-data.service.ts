import { Injectable } from '@angular/core';

//Json sources:

import * as qvDimensions from 'src/data/example/current/qvDimensions.json';
import * as qvEvidence from 'src/data/example/current/qvEvidence.json';
import * as qvProject from 'src/data/example/current/qvProject.json';
import * as qvSubProjects from 'src/data/example/current/qvSubProjects.json';
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

  dimensions:Dimension[] = [];
  evidence:Evidence[] = [];
  project:Project = {projectName: '', elements:[], relationships:[], subProjects:[], tempElementScoreScale:0, styleOverrideHeight:"", styleOverrideWidth: ""};
  subProjects:any[] = []; //TODO: Need a model.
  results:Result[] = [];

  constructor() {
    // var dataSelectorName = 'example/current'
    var dataSelectorName = '' + environment.dataSource; // Dynamic import() has to be sure that it will be a string, so can have no completely dynamic elements. Hence the leading '', if you remove this it will fail!
    //var resultsPath = '../../data/example/current/qvResults.json';//'src/data/example/current/qvResults.json';
    var dimensionsPath = 'src/data/example/current/qvDimensions.json';
    var evidencePath = 'src/data/example/current/qvEvidence.json';
    var projectPath = 'src/data/example/current/qvProject.json';
    var subprojectsPath = 'src/data/example/current/qvSubProjects.json';
    // import * as qvSubProjects from 'src/data/example/current/qvSubProjects.json';
    // var path = ""
    import('../../data/' + dataSelectorName + '/qvResults.json').then(qvResults => {
      this.results = qvResults.results;
    });
    console.log(this.results);
    import('../../data/' + dataSelectorName + '/qvDimensions.json').then(qvDimensions => {
      this.dimensions = qvDimensions.dimensions;
    });
    import('../../data/' + dataSelectorName + '/qvEvidence.json').then(qvEvidence => {
      this.evidence = qvEvidence.evidence;
    });
    import('../../data/' + dataSelectorName + '/qvProject.json').then(qvProject => {
      this.project = qvProject.project;
    });
    import('../../data/' + dataSelectorName + '/qvSubProjects.json').then(qvSubProjects => {
      this.subProjects = qvSubProjects.subProjects;
    });
    // var subprojectsPath = 'src/data/example/current/qvSubProjects.json';

    if(!this.project){
      throw new Error("No project file loaded");

    }

  }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // console.log(this.dimensions)
    // console.log(this.evidence)
    // console.log(this.project)
    // console.log(this.results)
    // console.log(this.subProjects)
  }


}
