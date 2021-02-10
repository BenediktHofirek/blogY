import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHolder } from 'angular2-image-upload';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent {
  newPhoto: string;
  customStyle = {
    clearButton: {
      display: 'none',
    }
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: {callback: (newPhoto: string) => void}) {}

  onUploadFinished(file: FileHolder) {
    this.isFileUploaded = true;
    this.data.callback(file.src);
  }
}