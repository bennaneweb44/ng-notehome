import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/_common/global-constants';
import { Categorie } from 'src/app/_models/categorie.model';
import { ArticleService } from 'src/app/_services/article/article.service';
import { CategorieService } from 'src/app/_services/categorie/categorie.service';
import { RayonService } from 'src/app/_services/rayon/rayon.service';

@Component({
  selector: 'app-rayon-list',
  templateUrl: './rayon-list.component.html',
  styleUrls: ['./rayon-list.component.css']
})
export class RayonListComponent implements OnInit {

  rayons: any[] = [];  
  allRayons: {};  
  categories: Categorie[] = [];
  rayonsWithArticles: any[] = [];
  error: string;

  // Pagination
  p: number = 1;

  constructor(private RayonService: RayonService,
              private ArticleService: ArticleService,
              private categorieService: CategorieService
  ) { }

  ngOnInit(): void {

    // Set Global Categories
    this.categorieService.getCategories()
      .subscribe(categorieResponse => {

        // Set local categories for <select></select>
        if (categorieResponse) {
          JSON.parse(categorieResponse)['hydra:member'].forEach(element => {
            this.categories.push({id: element.id, titre: element.titre, couleur: element.couleur, icone: element.icone});
          });
        }        
    });

    this.ArticleService.getRayonsWithArticles().subscribe(
      data => {
        let jsonRayons = JSON.parse(data)['hydra:member'];       
        
        let arrRayons: any[] = [];
        let arrNbArticles: any[] = [];
        
        jsonRayons.forEach(obj => {
          Object.entries(obj).forEach(([key, value]) => {            
            if (key == 'rayon_id') {              
              arrRayons.push(value);
            } else if (key == 'nb_articles') {
              arrNbArticles.push(value);
            }
          });

          for(let i=0; i < arrRayons.length; i++) {
            this.rayonsWithArticles[arrRayons[i]] = arrNbArticles[i];
          }

        });
      },
      err => {
        let message = JSON.parse(err.error).message;
        if (message == 'JWT Token not found') 
        {
          this.error = 'Vous devez vous connecter pour avoir accès à ce contenu !';
        }
      }
    );

    this.RayonService.getRayons().subscribe(
      data => {
        data = JSON.parse(data);
        this.allRayons = data['hydra:member'];
        this.setFilteredRayons('Courses');        
      },
      err => {
        let message = JSON.parse(err.error).message;
        if (message == 'JWT Token not found') 
        {
          this.error = 'Vous devez vous connecter pour avoir accès à ce contenu !';
        }
      }
    );
  }

  private setFilteredRayons(filter : string) : void 
  {
    if (this.rayons.length > 0) {      
      this.rayons = [];
    }

    // Par défault (categorie='Courses')        
    let categorie_defaut = '/api/categories/';

    this.categories.forEach(element => {
      if (element.titre == filter) {
        categorie_defaut += element.id;
      }          
    });

    // Filter collection
    for(let i=0; i<Object.keys(this.allRayons).length; i++) {          
      if (this.allRayons[i].categorie == categorie_defaut) {
        this.rayons.push(this.allRayons[i]);
      }
    }
  }

  updateInsteadCategory(categorie) : void 
  {
    this.setFilteredRayons(categorie);
  }

}
