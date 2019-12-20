import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Name } from './name';

@Injectable({
  providedIn: 'root'
})
export class NameValidator {

  constructor(private http: HttpClient) {}

  /**
   * Async Validator.
   * Prüft, ob Name bereits im Backend vorhanden.
   * @param control FormControl für welches der Async Validator ausgeführt werden soll.
   */
  public namesAsyncValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors | null> => {
      return this.http.get<Name[]>(`http://localhost:3000/names?name=${control.value}`).pipe(
        map((res: Name[]) => !!res ? { nameAssigned: 'Name already assigned.' } : null)
      );
    };
  }

}
