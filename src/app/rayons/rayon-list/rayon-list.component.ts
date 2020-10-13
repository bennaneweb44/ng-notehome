import { Component, OnInit } from '@angular/core';
import { RayonService } from '../../_services/rayon/rayon.service';

@Component({
  selector: 'app-rayon-list',
  templateUrl: './rayon-list.component.html',
  styleUrls: ['./rayon-list.component.css']
})
export class RayonListComponent implements OnInit {

  rayons: string;
  error: string;

  constructor(private RayonService: RayonService) { }

  ngOnInit(): void {
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
