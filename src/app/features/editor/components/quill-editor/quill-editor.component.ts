import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuillEditorComponent implements OnInit {
  @Input() source: object;
  @Output() save = new EventEmitter<object>(); 
  editor: Quill;
  isContentChanged = false;
  
  @ViewChild('editor', {
    static: true
  }) editorRef: any;

  constructor() { }

  ngOnInit(): void {
    this.initEditor();
  }

  initEditor() {
    this.editor = new Quill(this.editorRef?.nativeElement, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        
          ['blockquote', 'code-block'],
        
          [{ 'header': 1 }, { 'header': 2 }],               
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      
          [{ 'indent': '-1'}, { 'indent': '+1' }],         
          [{ 'direction': 'rtl' }],                        
        
          [{ 'size': ['small', 'normal', 'large', 'huge'] }],  
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
          [{ 'color': [] }, { 'background': [] }],        
          [{ 'font': [] }],
          [{ 'align': [] }],     
          ['image', 'code-block', 'link']                               
        ],
        history: {
          delay: 0,
          maxStack: 1000,
          userOnly: false
        },
      },
      placeholder: 'Write something...',
      theme: 'snow'
    });
    
    if (this.source) {
      this.editor.setContents(<any>this.source);
    }

    this.editor.on('text-change', () => {
      this.isContentChanged = true;
    });
  }
  
  handleSave() {
    this.isContentChanged = false;
    const source = this.editor.getContents();
    this.save.emit(source);
  }

  canSave() {
    return this.isContentChanged && this.editor.getText().length > 1
  }
}
