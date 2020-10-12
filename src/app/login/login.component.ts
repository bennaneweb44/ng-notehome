import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const BACKEND_API = 'http://localhost:8000/api';

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
          this.http.get(BACKEND_API + '/users', {headers: {
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

        //let user = this.tokenStorage.getUser();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

}
