// import { AbstractControl, Validators } from '@angular/forms';

// export class CustomValidators {
//   static ValidateConfirmPassword(AC: AbstractControl) {
//     if (!AC.get('password') || !AC.get('confirmPassword')) {
//       return;
//     }
//     let password = AC.get('password').value;
//     let confirmPassword = AC.get('confirmPassword').value;

//     if (password && confirmPassword && password != confirmPassword) {
//       AC.get('confirmPassword').setErrors({ confirmPasswordError: true });
//     }

//     return null;
//   }

//   static ValidatePasswordAndOldPassword(AC: AbstractControl) {
//     if (!AC.get('oldPassword') || !AC.get('password')) {
//       return;
//     }
//     let oldPassword = AC.get('oldPassword').value;
//     let password = AC.get('password').value;

//     if (oldPassword && password && oldPassword === password) {
//       AC.get('password').setErrors({ newPasswordError: true });
//     }
//     return null;
//   }
// }
