import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Observable<Leader[]>{
    return of (LEADERS).pipe(delay(2000));
  }

  getLeader(id: string): Observable<Leader> {
    return of(LEADERS.filter((Leader)=> (Leader.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader>{
    return of(LEADERS.filter((leader)=> leader.featured)[0]).pipe(delay(2000));
  }
}
