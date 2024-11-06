import { Observable, OperatorFunction, finalize, tap } from 'rxjs'
import { WritableSignal } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

function isSignal<T>(
  loadingIndicator: WritableSignal<T> | BehaviorSubject<T>,
): loadingIndicator is WritableSignal<T> {
  return 'set' in loadingIndicator
}

// Operator for managing loading state
export function withLoading<T>(
  loadingIndicator: WritableSignal<boolean> | BehaviorSubject<boolean>,
): OperatorFunction<T, T> {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap(() => {
        if (isSignal(loadingIndicator)) {
          loadingIndicator.set(true)
        } else {
          loadingIndicator.next(true)
        }
      }),
      finalize(() => {
        if (isSignal(loadingIndicator)) {
          loadingIndicator.set(false)
        } else {
          loadingIndicator.next(false)
        }
      }),
    )
  }
}
