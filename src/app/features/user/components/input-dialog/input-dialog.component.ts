import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ValidateUsernameService } from 'src/app/shared/services/validate-username.service';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {
  formControl: FormControl; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: {initialValue: string, type: string, name: string},
              private validateUsername: ValidateUsernameService,
              ) {
    const validatorList = [Validators.required];
    const asyncValidatorList: any[] = [];
  
    if (data.type === 'email') {
      validatorList.push(Validators.email);
    }

    if (data.name === 'username') {
      asyncValidatorList.push(this.validateUsername.validate)
    }
   
    this.formControl = new FormControl(data.initialValue, {
      updateOn: 'change',
      validators: validatorList,
      asyncValidators: asyncValidatorList
    });
  }

  firstLetterUpperCase(name: string) {
    return name[0].toUpperCase() + name.slice(1);
  }
}