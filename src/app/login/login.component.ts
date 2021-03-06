import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../_common/global-constants';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userNameLogged: '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.userNameLogged = this.tokenStorage.getUser().username;
    }
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {

        // Token
        let token = data.token;                

        // Get user
        if (typeof token == "string" && token.trim() != '') {

          // All users
          this.http.get(GlobalConstants.apiURL + '/users', {headers: {
            "Authorization": 'Bearer '+token
          }}).subscribe(usersListResponse => {
            let all_users = usersListResponse['hydra:member'];

            all_users.forEach(element => {
              if (element.username == this.form.username) {
                this.tokenStorage.saveUser(element);
                this.tokenStorage.saveToken(token);                
                
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.userNameLogged = element.username;
                this.reloadPage();
              }
            });            
            
          });
        }
        
      },
      err => {
        if (err.statusText == 'Unknown Error') {
          this.errorMessage = 'Une erreur interne s\'est produite. Merci de réessayer plus tard ! ';
          this.isLoginFailed = true;
        }        
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

}
