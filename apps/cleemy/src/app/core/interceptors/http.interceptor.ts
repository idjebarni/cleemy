import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { ExpenseActions } from '../../modules/expense-list/store/expense.actions';

@Injectable()
export class CleemyInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler) {
    return next.handle(httpRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.headers.has('X-Total-Count')) {
          this.store.dispatch(
            new ExpenseActions.UpdateTotalCount(parseInt(event.headers.get('X-Total-Count') as string)),
          );
        }
        return event;
      }),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }
}
