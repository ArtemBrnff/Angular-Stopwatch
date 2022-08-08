import { Component } from '@angular/core';
import { Observable, fromEvent, buffer, debounceTime, map, filter, Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-stopwatch';

  mm: any = '0' + 0
  ss: any = '0' + 0
  running: boolean = false
  click$ = new Subject<void>();
  start$ = new Subject<void>();
  destroy$ = new Subject<void>();

  doubleClick$ = this.click$.pipe(
    buffer(
      this.click$.pipe(debounceTime(500))
    ),
    map(list => {
      return list.length;
    }),
    filter(x => x === 2),
  )

  doubleClickForBooling$ = this.click$.pipe(
    buffer(
      this.click$.pipe(debounceTime(500))
    ),
    map(list => {
      return list.length;
    }),
    filter(x => x === 2),
  ).subscribe(_ => {
    this.running = false
  });
  //its bad to copy code, but don`t know how to do it in other way, can`t use subscribe() with takeUntil()

  timer$ = interval(1000).pipe(
    takeUntil(this.start$),
    takeUntil(this.destroy$),
    takeUntil(this.doubleClick$),
  );

  start(): void {
    if (!this.running) {
      this.running = true
      this.start$.next(this.ss);
      this.timer$.subscribe(v => v < 60 && (this.ss = v < 10 ? this.ss = '0' + v : this.ss = v));
      this.timer$.subscribe(v => {
        if (v === 60) {
          this.running = false
          this.mm++
          this.mm = this.mm < 10 ? '0' + this.mm : this.mm
          this.ss = '0' + 0
          this.start()
        }
      });
    }
    else {
      this.destroy$.next();
      this.ss = '0' + 0
      this.mm = '0' + 0
      this.running = false
    }
  }

  reset(): void {
    this.running = false
    this.start()
    // this.start$.next(this.ss);
    // this.timer$.subscribe(v => this.ss = v < 10 ? this.ss = '0' + v : this.ss = v);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
