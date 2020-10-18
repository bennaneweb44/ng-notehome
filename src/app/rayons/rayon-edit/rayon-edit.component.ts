import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  categories: Categorie[] = [
    {id: 1, titre: 'Courses', couleur: 'bg-yellow', icone: 'fa-shopping-cart'},
    {id: 2, titre: 'Bricolage', couleur: 'bg-green', icone: 'fa-tasks'},
    {id: 3, titre: 'Administratif', couleur: 'bg-red', icone: 'fa-child'},
    {id: 4, titre: 'Voiture', couleur: 'bg-aqua', icone: 'fa-car'},
    {id: 5, titre: 'Boucher', couleur: 'bg-aqua', icone: 'fa-food'},
    {id: 6, titre: 'A définir', couleur: 'bg-aqua', icone: 'fa-pencil'}
  ];
  
  idRayon: number;
  rayon: any = {};
  articles: any[] = [];

  // Form
  rayonForm :  FormGroup;

  constructor(
    private route: ActivatedRoute,
    private rayonService: RayonService,
    private categorieService: CategorieService,
    private articleService: ArticleService,
    private fb: FormBuilder,
    private tokenStorageService: TokenStorageService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {

    // Rayon en cours
    this.idRayon = +this.route.snapshot.paramMap.get('id');
    this.getRayon();    
  }

  /*################################ Form ###################################*/

  initializeForm(): void {
    this.rayonForm = this.fb.group({
      titre: ['', Validators.required],
      couleur: ['', Validators.required],
      categories: ['', Validators.required]
    });
  }

  save() {    
    console.log('Données du forulaire, id = ' + this.idRayon + ' *** ', this.rayonForm.value);
  }

  /*############################ REST requests ###############################*/

  getRayon(): void {    

    // Catégories
    this.categorieService.getCategories()
      .subscribe(categorieResponse => {
        GlobalConstants.allCategories = JSON.parse(categorieResponse);        
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
