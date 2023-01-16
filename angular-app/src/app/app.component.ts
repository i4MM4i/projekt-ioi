import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseDialogComponent } from './response-dialog/response-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  imageURL: string =
    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
  uploadForm: FormGroup;
  chosenFuture!: number;
  imagePath: SafeResourceUrl =
    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
  clicked!: number | null;
  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      image_file: [null, Validators.required],
      environment: ['', Validators.required],
      prompt: [''],
    });
  }
  ngOnInit(): void {}

  // Image Preview
  showPreview(event: any) {
    if (!event) {
      return;
    }
    // @ts-ignore: Object is possibly 'null'.
    const file = (event!.target as HTMLInputElement)!.files[0];
    this.uploadForm.patchValue({
      image_file: file,
    });
    // @ts-ignore: Object is possibly 'null'.
    this.uploadForm.get('image_file').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  // Submit Form
  onSubmit() {
    if (this.uploadForm.invalid) {
      let text = "";
      if (!this.uploadForm.value.image_file){
        text += "You have not provided an image.<br>"
      }
      if (!this.uploadForm.value.environment){
        text += "You have not chosen an environment.<br>"
      }
      if (!this.uploadForm.value.prompt){
        text += "You have not described the image.<br>"
      }
      Swal.fire({
        title: 'Error!',
        html: text,
        icon: 'error',
        confirmButtonText: 'Ok',
        heightAuto: false,
        backdrop: `
        rgba(255,255,255, 0.2)
        left top
        no-repeat
      `
      })
      return;
    }
    this.generatePrompt();
    console.log(this.uploadForm.value);
    this.apiService
      .generateFutureImage(
        this.uploadForm.value.image_file,
        this.uploadForm.value.prompt
      )
      .subscribe((value) => {
        console.log(value);
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + value.image
        );
        this.openDialog();
      });
      this.uploadForm.patchValue({
        prompt: '',
      });

  }

  generatePrompt() {
    switch (this.chosenFuture) {
      case 0:
        this.uploadForm.patchValue({
          prompt: `A ${this.uploadForm.value.environment} overgrown with plants, detailed, real photo`,
        });
        break;
      case 1:
        this.uploadForm.patchValue({
          prompt: `A flooded ${this.uploadForm.value.environment}, detailed, real photo`,
        });
        break;
      case 2:
        this.uploadForm.patchValue({
          prompt: `A ${this.uploadForm.value.environment} on fire, detailed, real photo`,
        });
        break;
      case 3:
        this.uploadForm.patchValue({
          prompt: `A ${this.uploadForm.value.environment} full of trash, detailed, real photo`,
        });
        break;
      case 4:
        this.uploadForm.patchValue({
          prompt: `A post apocalyptic ${this.uploadForm.value.environment}, detailed, real photo`,
        });
        break;
      case 5:
        this.uploadForm.patchValue({
          prompt: `A ${this.uploadForm.value.environment} completely frozen during an ice age, detailed, real photo"`,
        });
        break;
      default:
        break;
    }
  }

  changeFuture(newFuture: number) {
    this.chosenFuture = newFuture;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResponseDialogComponent, {
      data: { imagePath: this.imagePath },
      width: '100%',
      minHeight: 'calc(100vh - 200px)',
      height : 'auto',
      backdropClass: "bdrop",
      panelClass:'bg-blue'
    });
  }
}
