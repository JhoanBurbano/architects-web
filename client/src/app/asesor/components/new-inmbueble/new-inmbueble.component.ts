import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { ICreateProperty, IProperty } from '@src/app/models/properties';
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
  public cities: string[] = []

  constructor(
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
        garage: [false],
      }),
      price: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.asesorS.loadCities()
    .pipe(takeUntil(this.unsubscribe$),
    switchMap((cities: string[])=>{
      this.cities = cities;
      return this.newInmuebleForm.valueChanges
    })
    )
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
    this.archivos.forEach((file) => {
      imgFormData.append('files', file);
    });

    this.asesorS
      .uploadFiles(imgFormData)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((data) => this.createInmueble(data)),
        catchError((error: any) => {
          this.toast.error(error.message, error.name);
          return of(error.error);
        })
      )
      .subscribe((data) => {
        this.toast.success(data.message, 'DONE');
        this.router.navigate(['/profile/', 'board']);
      });
  }

  createInmueble(imgs: string[]) {
    if (this.newInmuebleForm.valid) {
      const Inmueble: ICreateProperty = {
        type: this.newInmuebleForm.get('type')?.value,
        city: this.newInmuebleForm.get('city')?.value,
        sector: this.newInmuebleForm.get('sector')?.value,
        description: this.newInmuebleForm.get('description')?.value,
        features: {
          levels: this.newInmuebleForm.controls['attr'].get('levels')?.value,
          rooms: this.newInmuebleForm.controls['attr'].get('rooms')?.value,
          baths: this.newInmuebleForm.controls['attr'].get('baths')?.value,
          garage: this.newInmuebleForm.controls['attr'].get('garage')?.value,
        },
        price: this.newInmuebleForm.get('price')?.value,
        images: imgs,
        tags: this.tags,
        active: true,
      };
      return this.asesorS.createProperty(Inmueble);
    }
    return of(new Error('El formulario no es valido'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
