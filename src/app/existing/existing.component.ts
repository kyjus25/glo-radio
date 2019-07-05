import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ColumnBody, GloSDK} from '@kyjus25/glo-rxjs-sdk';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './existing.component.html',
  styleUrls: ['./existing.component.css']
})
export class ExistingComponent implements OnInit, AfterViewInit {

  public fadeContainer: Element = null;
  public board: string;
  public boardOptions;

  constructor(private gloSDK: GloSDK, private router: Router) {
    this.gloSDK.boards.get().subscribe(boards => {
      this.boardOptions = [];
      boards.forEach(board => this.boardOptions.push({label: board.name, value: board.id}));
    });
  }

  public ngOnInit() {
    this.fadeContainer = document.getElementById('fade-container');
  }

  ngAfterViewInit(): void {
    this.fadeContainer.className = 'visible';
  }

  public selectBoard() {
    this.fadeContainer.className = 'hidden';
    setTimeout(() => {
      this.router.navigate(['player'], { queryParams: { boardId: this.board }}).then();
    }, 300);
  }

}


