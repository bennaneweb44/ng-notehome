import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RayonService } from 'src/app/_services/rayon/rayon.service';
import { ArticleService } from 'src/app/_services/article/article.service';

@Component({
  selector: 'app-rayon-edit',
  templateUrl: './rayon-edit.component.html',
  styleUrls: ['./rayon-edit.component.css']
})
export class RayonEditComponent implements OnInit {

  rayon: any = {};
  articles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rayonService: RayonService,
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void {
    this.getRayon();
  }

  getRayon(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    // Get Rayon by id
    this.rayonService.getRayon(id)
      .subscribe(rayonResponse => {
        this.rayon = JSON.parse(rayonResponse);
    });    

    // Get Articles of this Rayon
    this.articleService.getArticles(id)
      .subscribe(articlesResponse => {
        let articles = JSON.parse(articlesResponse);
        this.articles = articles['hydra:member'];
    });
    
  }

}
