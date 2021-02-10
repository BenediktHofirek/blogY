import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHolder } from 'angular2-image-upload';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnDestroy {
  newPhoto: string;
  isTooBig = false;
  isWrongFileType = false;
  reader: FileReader;

  constructor() {
    this.reader = new FileReader();

    this.reader.addEventListener('load', this.handleLoad);
    // this.reader.addEventListener('progress', this.handleProgress);
    // this.reader.addEventListener('error', handleEvent);
  }

  ngOnDestroy() {
    this.reader.removeEventListener('load', this.handleLoad);
    // this.reader.removeEventListener('progress', this.handleProgress);
  }

  handleImageUpload(file: File) {
    this.isTooBig = file.size > 256 * 256;
    this.isWrongFileType = !/.*\.(png|jpg|jgeg|svg)/.test(file.name);

    if (!this.isWrongFileType && !this.isTooBig) {
      this.reader.readAsDataURL(file);
    }
  }

  handleLoad(event: any) {
    console.log(event.currentTarget.result);
    this.newPhoto = event.currentTarget.result;
    console.log(this.newPhoto);
  }

  handleProgress(event: any) {
    console.log('handleProgress',event);
  }
}