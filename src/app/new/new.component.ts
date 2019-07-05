import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ColumnBody, GloSDK} from '@kyjus25/glo-rxjs-sdk';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, AfterViewInit {

  public fadeContainer: Element = null;
  public boardName: string;

  constructor(private gloSDK: GloSDK, private router: Router) {}

  public ngOnInit() {
    this.fadeContainer = document.getElementById('fade-container');
  }

  ngAfterViewInit(): void {
    this.fadeContainer.className = 'visible';
  }

  public createBoard() {
    this.gloSDK.boards.create({name: this.boardName}).subscribe(createdBoard => {
      const columns: ColumnBody[] = [
        {'name': 'Saved Tracks', 'position': 0},
        {'name': 'Queue', 'position': 1},
        {'name': 'Now Playing', 'position': 2},
      ];
      this.gloSDK.columns.batchCreate(createdBoard.id, columns).subscribe(createdColumns => {
        this.fadeContainer.className = 'hidden';
        setTimeout(() => {
          this.router.navigate(['player'], { queryParams: { boardId: createdBoard.id }}).then();
        }, 300);
      });
    });
  }

}


