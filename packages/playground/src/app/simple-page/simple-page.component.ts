import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { QueryClientService, UseQuery } from '@ngneat/query';
import { SubscribeModule } from '@ngneat/subscribe';
import { map } from 'rxjs';
import { DialogComponent } from '../dialog.component';
import { GithubApiService } from '../github.service';
const API_URL = 'https://random-data-api.com/api/v2/users?size=3';

@Component({
  standalone: true,
  imports: [SubscribeModule, DialogComponent, CommonModule],
  template: `
    <div>
      <button (click)="queryClient.invalidateQueries(['characters'])">
        Invalidate Query
      </button>

      <button (click)="showDialog = !showDialog">Toggle Dialog</button>
      <ng-container *ngIf="characters$ | async as characters">
        <p *ngIf="characters.status === 'loading'">Loading...</p>
        <p *ngIf="characters.status === 'error'">Error :(</p>
        <ng-container *ngIf="characters.status === 'success'">
          <article *ngFor="let person of characters.data">
            {{ person.id }} - {{ person.first_name }} {{ person.last_name }}
          </article>
        </ng-container>
      </ng-container>
      <ng-query-custom-dialog *ngIf="showDialog"></ng-query-custom-dialog>
    </div>
  `,
})
export class SimplePageComponent {
  http = inject(HttpClient);
  useQuery = inject(UseQuery);
  queryClient = inject(QueryClientService);

  showDialog = false;
  characters$;

  constructor() {
    const f = () => this.http.get<any>(API_URL);
    f['aaa'] = 'comp';
    this.characters$ = this.useQuery(['characters'], f).result$;
  }
}
