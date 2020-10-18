import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/_common/global-constants';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

// Models
import { Categorie } from 'src/app/_models/categorie.model';

// Services
import { RayonService } from 'src/app/_services/rayon/rayon.service';
import { CategorieService } from 'src/app/_services/categorie/categorie.service';
import { ArticleService } from 'src/app/_services/article/article.service';

@Component({
  selector: 'app-rayon-edit',
  templateUrl: './rayon-edit.component.html',
  styleUrls: ['./rayon-edit.component.css']
})
export class RayonEditComponent implements OnInit {

  // Todo : Doivent être récupérés à partir du backend
  categories: Categorie[] = [];
  
  idRayon: number;
  rayon: any = {};
  articles: any[] = [];

  // Form
  rayonForm :  FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rayonService: RayonService,
    private categorieService: CategorieService,
    private articleService: ArticleService,
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    
    // Rayon en cours
    this.idRayon = +this.route.snapshot.paramMap.get('id');
    this.getRayon();    
  }

  initializeForm(): void {
    this.rayonForm = this.fb.group({
      titre: ['', Validators.required],
      couleur: ['#ffffff', Validators.required],
      categories: ['', Validators.required]
    });
  }

  save() {

    let id_categorie = this.rayonForm.get('categories').value;

    if (id_categorie > 0) {
      let  newTitre = this.rayonForm.value.titre;
      let newCouleur = this.rayonForm.value.couleur;
      let newCategorie = id_categorie;

      // Get current user
      let currentUser = this.tokenStorageService.getUser();

      // Current date of update
      let ts = new Date();

      // Json
      let newRayon = {
        "titre"     :  newTitre,
        "couleur"   : newCouleur,
        "categorie" : '/api/categories/' + newCategorie,
        "updatedAt" : ts.toJSON(),
        "modifId"   : currentUser.id
      }      

      // Post request
      this.rayonService.setRayon(this.idRayon, newRayon).subscribe(
        data => {
          this.router.navigate(['rayons']); 
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  getRayon(): void {

    // Set Global Categories
    this.categorieService.getCategories()
      .subscribe(categorieResponse => {
        GlobalConstants.allCategories = JSON.parse(categorieResponse);        

        // Set local categories for <select></select>
        GlobalConstants.allCategories['hydra:member'].forEach(element => {
          this.categories.push({id: element.id, titre: element.titre, couleur: element.couleur, icone: element.icone});
        });
    });

    // Get Rayon by id
    this.rayonService.getRayon(this.idRayon)
      .subscribe(rayonResponse => {
        this.rayon = JSON.parse(rayonResponse);  
        
        let split = this.rayon.categorie.split('/');
        let id_categorie = split[split.length -1];        
        
        this.categories.forEach(element => {

          if (element.id == id_categorie) {    
            
            this.rayonForm.patchValue({
              titre: this.rayon.titre,
              couleur: this.rayon.couleur,
              categories: [this.categories]
            });
            this.rayonForm.controls['categories'].setValue(element.id, {onlySelf: true});            
          }          
        });

    });     

    // Get Articles of this Rayon
    this.articleService.getArticles(this.idRayon)
      .subscribe(articlesResponse => {
        let articles = JSON.parse(articlesResponse);
        this.articles = articles['hydra:member'];
    });    
  }

}
