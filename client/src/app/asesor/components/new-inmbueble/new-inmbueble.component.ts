import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { inmuebleI } from 'src/app/models/inmuebles';
import { AsesorService } from 'src/app/services/asesor.service';

@Component({
  selector: 'app-new-inmbueble',
  templateUrl: './new-inmbueble.component.html',
  styleUrls: ['./new-inmbueble.component.scss'],
})
export class NewInmbuebleComponent implements OnInit, OnDestroy {
  public imagenes: Array<string> = [];
  public archivos: any[] = [];
  public tags: string[] = [];
  public newInmuebleForm: FormGroup;
  public isvalid: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild('uploadImage') private uploadImage!: ElementRef;
  public imageSelected: any;
  public isDisabled: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private fb: FormBuilder,
    private asesorS: AsesorService,
    private router: Router
  ) {
    this.newInmuebleForm = this.fb.group({
      type: ['', Validators.required],
      city: ['', Validators.required],
      sector: ['', Validators.required],
      description: ['', Validators.required],
      attr: this.fb.group({
        levels: ['', Validators.required],
        rooms: ['', Validators.required],
        baths: ['', Validators.required],
        garage: ['', Validators.required],
      }),
      price: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.newInmuebleForm.valueChanges
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.isDisabled = !!!(
        this.newInmuebleForm.valid &&
        this.tags.length &&
        this.imagenes.length
      );
    });
  }

  onClickUpload() {
    this.uploadImage.nativeElement.click();
  }

  cargarImagen(event: any): any {
    let e = event.target.files[0];
    this.extraerBase64(e).then((image: any) => {
      this.imagenes.push(image.base);
      this.imageSelected = image.base;
      this.archivos.push(e);
      this.isDisabled = !!!(
        this.newInmuebleForm.valid &&
        this.tags.length &&
        this.imagenes.length
      );
    });
  }

  noImage(id: number) {
    this.imagenes.splice(id, 1);
    this.archivos.splice(id, 1);
  }

  showImage(id: number) {
    this.imageSelected = this.imagenes[id];
  }

  cargarTag(event: any): void {
    event.preventDefault();
    if (event.target.value !== ' ' && event.target.value !== '') {
      if (this.tags.length < 10) {
        this.tags.push(event.target.value);
      } else {
        this.toast.warning('NO puedes agregar mas tags');
      }
    } else {
      this.toast.warning('NO se puede ingresar un tag vacío', 'WARNING');
    }
    event.target.value = '';
    this.isDisabled = !!!(
      this.newInmuebleForm.valid &&
      this.tags.length &&
      this.imagenes.length
    );
  }

  noTag(id: number) {
    this.tags.splice(id, 1);
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (e) {
        return null;
      }
    });

  sendForm() {
    let imgFormData = new FormData();
    this.archivos.forEach((e) => {
      imgFormData.append('files', e);
    });

    this.asesorS
      .postImg(imgFormData)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((data) => this.createInmueble(data.paths)),
        catchError((error: any) => {
          this.toast.error(error.message, error.name);
          return of(error.error);
        })
      )
      .subscribe((data) => {
        this.toast.success(data.message, 'DONE');
        this.router.navigate(['/asesor/', 'inmuebles']);
      });
  }

  createInmueble(imgs: string[]) {
    if (this.newInmuebleForm.valid) {
      const Inmueble: inmuebleI = {
        type: this.newInmuebleForm.get('type')?.value,
        city: this.newInmuebleForm.get('city')?.value,
        sector: this.newInmuebleForm.get('sector')?.value,
        description: this.newInmuebleForm.get('description')?.value,
        attr: {
          levels: this.newInmuebleForm.controls['attr'].get('levels')?.value,
          rooms: this.newInmuebleForm.controls['attr'].get('rooms')?.value,
          baths: this.newInmuebleForm.controls['attr'].get('baths')?.value,
          garage: this.newInmuebleForm.controls['attr'].get('garage')?.value,
        },
        price: this.newInmuebleForm.get('price')?.value,
        favs: 0,
        assesor: {
          email: '',
          name: '',
        },
        comments: [],
        img: imgs,
        tags: this.tags,
        active: true,
      };
      return this.asesorS.createInm(Inmueble);
    }
    return of(new Error('El formulario no es valido'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
