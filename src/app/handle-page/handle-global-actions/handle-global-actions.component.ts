import { Component, OnInit } from '@angular/core';
import { GLOBAL_ACTIONS_PATH } from '../handle-page-routing-paths';

@Component({
  selector: 'ds-handle-global-actions',
  templateUrl: './handle-global-actions.component.html',
  styleUrls: ['./handle-global-actions.component.scss']
})
export class HandleGlobalActionsComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  constructor() { }

  /**
   * The redirection path.
   */
  globalActionsPath: string;

  ngOnInit(): void {
    this.globalActionsPath = GLOBAL_ACTIONS_PATH;
  }

}
