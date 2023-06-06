import { Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "@src/app/services/user.service";
import { Subject, catchError, of, takeUntil } from "rxjs";

@Component({
  selector: "app-send-email",
  templateUrl: "./send-email.component.html",
  styleUrls: ["./send-email.component.scss"],
})
export class SendEmailComponent implements OnDestroy {
  public control: FormControl;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly userService: UserService,
    private dialogRef: MatDialogRef<SendEmailComponent>
  ) {
    this.control = new FormControl("", [Validators.required, Validators.email]);
  }

  sendEmail() {
    this.userService
      .forgotPassword(this.control.value)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          this.dialogRef.close(error);
          return of();
        })
      )
      .subscribe((response) => {
        console.log("->", response);
        this.dialogRef.close(response);
      });
  }

  setUpperCase() {
    this.control.setValue(this.control.value.trim());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
