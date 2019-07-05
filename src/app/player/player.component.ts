import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CardBody, CommentBody, GloSDK} from '@kyjus25/glo-rxjs-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';

const CONFIG = require('@assets/config.json');

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  public nowPlaying;

  public fadeContainer: Element = null;
  public boardId;

  private nowPlayingId;
  private queueId;

  private nowPlayingCards;
  private queueCards;

  private currentlyPlaying;

  constructor(
    private http: HttpClient,
    private gloSDK: GloSDK,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.hasOwnProperty('boardId')) {
        this.boardId = queryParams['boardId'];
        this.getBoardColumns();
      }
    });
  }

  private getBoardColumns() {
    this.gloSDK.boards.read(this.boardId, ['columns']).subscribe(board => {
      this.nowPlayingId = board.columns.find(column => column.name === 'Now Playing').id;
      this.queueId = board.columns.find(column => column.name === 'Queue').id;
      this.getCards();
    });
  }

  private getCards() {
    combineLatest([
      this.gloSDK.cards.getByColumn(this.boardId, this.queueId, {fields: ['name', 'description']}),
      this.gloSDK.cards.getByColumn(this.boardId, this.nowPlayingId, {fields: ['name', 'description']}),
    ]).subscribe(([queueCards, nowPlayingCards]) => {
      this.nowPlayingCards = nowPlayingCards;
      this.queueCards = queueCards;
      this.playVideo();
      this.listenWebhooks();
    });
  }

  private listenWebhooks() {
    setInterval(() => {
      this.http.get('http://localhost:1337/queue').subscribe(queue => {
        this.handleQueue(queue);
      });
    }, 3000);
  }

  private handleQueue(queue) {
    console.log(queue);
    queue.forEach(task => {
      if (task.hasOwnProperty('card') && task.action === 'added') {
        this.generateMetadata(task.board, task.card);
        // Start playing if now playing[0]
      }
      if (task.hasOwnProperty('card') && (task.action === 'reordered' || task.action === 'moved_column') ) {
        // this.moveCard(task.card, task.action);
        // if (task.card['position'] === 0) {
        //   this.playVideo();
        // }
        this.getCards();
        // Start playing if now playing[0]
      }
    });
    this.removeQueueItems();
  }

  // private moveCard(card, action) {
  //   const inNowPlaying = this.nowPlayingCards.find(cardIterate => cardIterate.id === card.id);
  //   const inQueue = this.queueCards.find(cardIterate => cardIterate.id === card.id);
  //   if (inQueue) {
  //     if (action === 'moved_column') {
  //       if (card.column_id !== inQueue.column_id) {
  //         this.queueCards = this.queueCards.filter(cardIterate => cardIterate.id !== card.id);
  //       }
  //     }
  //   }
  //   if (inNowPlaying) {
  //
  //   }
  // }

  private playVideo() {
    if (this.nowPlayingCards[0] && this.nowPlayingCards[0].description.text !== this.currentlyPlaying) {
      console.log('playing', this.nowPlayingCards[0].description.text);
      this.http.get('http://localhost:1337/play?videoID=' + this.nowPlayingCards[0].description.text).subscribe(res => {
        this.currentlyPlaying = this.nowPlayingCards[0].description.text;
        console.log(res);
      });
    }
    this.clearNowPlaying();
  }

  private clearNowPlaying() {
    for (let i = 0; i < this.nowPlayingCards.length; i++) {
      if (i !== 0) {
        const cardBody: CardBody = this.nowPlayingCards[i];
        cardBody.column_id = this.queueId;
        this.gloSDK.cards.update(this.boardId, this.nowPlayingCards[i].id, cardBody).subscribe(movedCard => {});
      }
    }
  }

  private generateMetadata(board, card) {
    this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='
      + card.name + ' official song&maxResults=1&key='
      + CONFIG['YOUTUBE_API_KEY']).subscribe(res => {
      const cardBody: CardBody = {
        name: res['items'][0]['snippet']['title'],
        column_id: this.queueId,
        description: {
          text: res['items'][0]['id']['videoId']
        }
      };
      const commentBody: CommentBody = {
        text: '![' + res['items'][0]['snippet']['title'] + ' Album Art](' + res['items'][0]['snippet']['thumbnails']['high']['url'] + ')'
      };
     // this.getBlobThumbnail(res['items'][0]['snippet']['thumbnails']['high']['url']).subscribe(blob => {
     //    console.log('blob', blob);
     //   const formData = new FormData();
     //   formData.append('file', new Blob([blob], {type: 'application/octet-stream'}));
     //    this.gloSDK.attachments.create(board.id, card.id, {file: formData}).subscribe(attachment => {
     //      console.log('attachment', attachment);
     //    });
     //  });
      this.gloSDK.comments.create(board.id, card.id, commentBody).subscribe(createdComment => {});
      this.gloSDK.cards.update(board.id, card.id, cardBody).subscribe(updatedCard => {});
    });
  }

  private removeQueueItems() {
    this.http.delete('http://localhost:1337/queue').subscribe(res => {});
  }

  public ngOnInit() {
    this.fadeContainer = document.getElementById('fade-container');
  }

  ngAfterViewInit(): void {
    this.fadeContainer.className = 'visible';
  }
}


