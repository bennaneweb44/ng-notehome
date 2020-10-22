import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  // declare a variable 'routeURL'
  // to keep track of current active route
  routeURL: string;

  constructor(private tokenStorage: TokenStorageService, private router: Router) {
    this.routeURL = this.router.url;
  }

  // the Router call canActivate() method,
  // if canActivate is registered in Routes[]
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // here we check if user is logged in or not
    // the authService returs user object, or
    // it returns undefined/null when user is not logged in
    
    // SINCE OUR 'authService.user' IS OF TYPE 'Observable'
    // WE MUST USE 'subscribe' TO GET VALUE OF 'user'
    return new Promise((resolve, reject) => {
      if (this.tokenStorage.getToken()) {
        // re-assign current route URL to 'routeURL'
          // when the user is logged in
          this.routeURL = this.router.url;
          // just return true - if user is logged in
          return resolve(true);
      } else {
        // assign '/login' in 'routeURL' to
          // avoid get into infinite loop
          this.routeURL = '/login';
          // when the user is not logged in,
          // instead of just returning false
          // inject router and redirect to '/login' or any other view
          this.router.navigate(['/login'], {
            // note: this queryParams returns the current URL
            // that we can have in 'return' parameter,
            // so when the '/login' page opens,
            // this param tell us from where it comes
            queryParams: {
              return: 'login'
            }
          });
        return resolve(false);
      }      
    });
  }
}
