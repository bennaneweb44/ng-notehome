import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/_services/article/article.service';
import { RayonService } from 'src/app/_services/rayon/rayon.service';

@Component({
  selector: 'app-rayon-list',
  templateUrl: './rayon-list.component.html',
  styleUrls: ['./rayon-list.component.css']
})
export class RayonListComponent implements OnInit {

  rayons: string;  
  rayonsWithArticles: any[] = [];
  error: string;

  constructor(private RayonService: RayonService,
              private ArticleService: ArticleService
  ) { }

  ngOnInit(): void {

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
        this.rayons = data['hydra:member'];
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

}
