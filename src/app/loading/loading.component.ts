import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() loading:boolean=false;
  @Input() httploading:boolean=false;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges($e:any): void {
    console.log(`Loading: changes==> [${JSON.stringify($e)}]`);
  }

}
