import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, FormGroupDirective, NgForm, FormControl } from '@angular/forms';

/**
 * Cross-field Validator.
 * Prüft, ob PLZ 5-stellig für Land Deutschland.
 * @param control FormGroup für die cross-field-Validierung ausgeführt werden soll.
 */
const landPlzValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const land = control.get('land').value;
  const postleitzahl = control.get('postleitzahl').value;
  console.log(`checking ${land} and ${postleitzahl}`);

  if (land === 'Deutschland' && postleitzahl.length !== 5) {
    console.log('validation error');
    return { landPlzError: 'Eine Postleitzahl in Deutschland muss 5-stellig sein.' };
  } else {
    return null;
  }
};

/**
 * ErrorStateMatcher für 'mat-error'-Komponente.
 * Gibt true (= Fehler) zurück, wenn FormControl invalid ist (Standard-Validatoren) oder FormGroup Error besitzt von 'landPlzValidator'.
 */
class CFLandPlzErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    console.log(`control dirty? ${control.dirty} form error? ${form.hasError('landPlzError')}`);
      /* control has standard validator error(s) */
      /* form has custom validator error */
    return control.invalid && control.touched || form.hasError('landPlzError');
  }
}

@Component({
  selector: 'av-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent {

  personForm: FormGroup;
  cfLandPlzErrorMatcher = new CFLandPlzErrorMatcher();

  constructor(private fb: FormBuilder) {
    this.initialiseFormGroup();
  }

  initialiseFormGroup(): void {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      alter: ['', Validators.required],
      land: ['', Validators.required],
      postleitzahl: ['', Validators.required]
    }, {
      validators: landPlzValidator
      /* validators: this.validateLandPlz */
    });
  }

  /*
  Auch möglich ist der Validator als Methode mit Rückgabe eines Error-Objektes:

  validateLandPlz(form: FormGroup) {
    const land = form.get('land').value;
    const postleitzahl = form.get('postleitzahl').value;

    console.log(`checking ${land} and ${postleitzahl}`);

    if (land === 'Deutschland' && postleitzahl.length !== 5) {
      console.log('validation error');
      return { landPlzError: 'Eine Postleitzahl in Deutschland muss 5-stellig sein.' };
    } else {
      return null;
    }
  }
  */
}
