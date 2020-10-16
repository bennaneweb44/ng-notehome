import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RayonService } from 'src/app/_services/rayon/rayon.service';
import { CategorieService } from 'src/app/_services/categorie/categorie.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalConstants } from 'src/app/_common/global-constants';

@Component({
  selector: 'app-rayon-edit',
  templateUrl: './rayon-edit.component.html',
  styleUrls: ['./rayon-edit.component.css']
})
export class RayonEditComponent implements OnInit {

  categories: any[] = [];
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
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    // Rayon en cours
    this.idRayon = +this.route.snapshot.paramMap.get('id');

    this.initializeForm();
    this.getRayon();    
  }

  /*################################ Form ###################################*/

  initializeForm(): void {
    this.rayonForm = this.fb.group({
      titre: '',
      couleur: '',
      categorie: ''
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
        
        let split = '/api/categories/1'.split('/');
        let id_categorie = split[split.length -1];
        
        
        GlobalConstants.allCategories['hydra:member'].forEach(element => {

          if (element.id == id_categorie) {                        
            this.rayonForm.patchValue({
              titre: this.rayon.titre,
              couleur: this.rayon.couleur,
              categorie: element.titre
            });
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
