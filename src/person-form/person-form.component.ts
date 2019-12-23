import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  FormGroupDirective,
  NgForm,
  FormControl,
  AsyncValidatorFn
} from '@angular/forms';
import { NameValidator } from './name.async-validator';

/**
 * Cross-field Validator.
 * Prüft, ob PLZ 5-stellig für Land Deutschland.
 * @param control FormGroup für die cross-field-Validierung ausgeführt werden soll.
 */
const landPlzValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const land = control.get('land').value;
  const postleitzahl = control.get('postleitzahl').value;

  if (land === 'Deutschland' && postleitzahl.length !== 5) {
    return { landPlzError: 'Eine Postleitzahl in Deutschland muss 5-stellig sein.' };
  } else {
    return null;
  }
};

/**
 * Common ErrorStateMatcher für 'mat-error'-Komponenten.
 * Gibt zurück, wenn FormControl invalid ist.
 */
class CommonErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.invalid && control.touched;
  }
}

/**
 * ErrorStateMatcher für 'mat-error'-Komponente.
 * Gibt true (= Fehler) zurück, wenn FormControl invalid ist (Standard-Validatoren) oder FormGroup Error besitzt von 'landPlzValidator'.
 */
class CFLandPlzErrorMatcher extends CommonErrorMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      /* control has standard validator error(s) */
      /* form has custom validator error */
    return super.isErrorState(control, form) || form.hasError('landPlzError');
  }
}

@Component({
  selector: 'av-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {

  personForm: FormGroup;
  cfLandPlzErrorMatcher = new CFLandPlzErrorMatcher();

  constructor(
    private fb: FormBuilder,
    private nameValidators: NameValidator) {
    this.initialiseFormGroup();
  }

  ngOnInit(): void {
    this.personForm.get('name').valueChanges.subscribe(x => {
      console.log(this.personForm.get('name'));
    });
  }

  initialiseFormGroup(): void {
    this.personForm = this.fb.group({
      name: ['', {
        validators: Validators.required,
        asyncValidators: NameValidator.instance.namesAsyncValidator()
        // asyncValidators: this.nameValidators.namesAsyncValidator()
      }],
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

    if (land === 'Deutschland' && postleitzahl.length !== 5) {
      return { landPlzError: 'Eine Postleitzahl in Deutschland muss 5-stellig sein.' };
    } else {
      return null;
    }
  }
  */
}
