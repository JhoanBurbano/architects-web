import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Keys, ROL } from "@src/app/enums/global.enum";
import { LocalStorageService } from "@src/app/services/local-storage.service";
import { Subject, catchError, of, takeUntil } from "rxjs";
import { HomeService } from "src/app/services/home.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-inmueble",
  templateUrl: "./inmueble.component.html",
  styleUrls: ["./inmueble.component.scss"],
})
export class InmuebleComponent implements OnInit, OnDestroy {
  public commentForm: FormGroup;
  public inmueble: any;
  public rol = this.localStorage.getKey(Keys.ROL);
  public favoritos: [] | any = [];
  public name = this.localStorage.getKey(Keys.USER);
  public comments: [] | any = [];
  private propertyId: string;
  private unsubscribe$: Subject<void> = new Subject<void>();
  public _ROL = ROL;
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private home$: HomeService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s.,¿?!¡À-ÿ\u00f1\u00d1]{2,250}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.captureParamId();
    this.obtenerInmueble(this.propertyId);
  }

  captureParamId() {
    this.propertyId = this.route.snapshot.params["idInm"];
  }

  async obtenerComentarios() {
    try {
      this.comments = await this.home$.getComment(this.propertyId);
    } catch (error: any) {
      Swal.fire(error.name, error.message, "error");
    }
  }

  obtenerInmueble(propertyId: string) {
    this.home$
      .getInmueble(propertyId)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          console.error(error);
          Swal.fire("Ocurrio un error", undefined, "error");
          return of();
        })
      )
      .subscribe((property) => {
        this.inmueble = property;
        this.comments = this.inmueble.comments;
      });
  }


  onUserNoLogged() {
    if (this.rol === "") {
      this.router.navigate(["/auth/signup"]);
    }
  }

  async addFavorite(propertyId: string) {
    try {
      const message = await this.home$.addFavorite(propertyId);
      if (message.message === "Añadido a favoritos") {
        Swal.fire({
          titleText: "Susess",
          text: message.message,
          icon: message.icon,
        });
      } else {
        const { isConfirmed, isDenied } = await Swal.fire({
          titleText: "¿Estas seguro que quieres remover de tus favoritos?",
          icon: "question",
          showDenyButton: true,
          showConfirmButton: true,
          confirmButtonText: "Si",
          denyButtonText: "No",
        });
        if (isConfirmed) {
          const removed = await this.home$.removeFavorite(propertyId);
          Swal.fire({
            titleText: "Susess",
            text: removed.message,
            icon: removed.icon,
          });
        }
      }
      this.obtenerInmueble(propertyId);
    } catch (error) {
      Swal.fire("Error del try", "Ocurrio un error");
    }
  }

  async addComment(event: any) {
    event.preventDefault();
    if (this.commentForm.valid) {
      try {
        const comment = {
          content: this.commentForm.get("content")?.value,
        };
        const msg = await this.home$.addComment(this.propertyId, comment);
        this.commentForm.reset();
        Swal.fire(msg.message, undefined, "success");
        this.obtenerComentarios();
      } catch (error: any) {
        Swal.fire(error.name, error.message, "error");
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
