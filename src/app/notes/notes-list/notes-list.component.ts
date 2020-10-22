import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/_common/global-constants';
import { CategorieService } from 'src/app/_services/categorie/categorie.service';
import { NoteService } from 'src/app/_services/note/note.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})

export class NotesListComponent implements OnInit {

  notes: any[] = []; 
  categories: any = {}; 
  error: string;

  // Pagination
  p: number = 1;

  constructor(private NoteService: NoteService, private categorieService: CategorieService) { }

  ngOnInit(): void {

    // Set Global Categories
    this.categorieService.getCategories()
      .subscribe(categorieResponse => {       

        // Set local categories for <select></select>
        JSON.parse(categorieResponse)['hydra:member'].forEach(elem => {
          if (elem) {
            this.categories[elem.id] = elem;
          }          
        });
    });
    
    this.NoteService.getNotes().subscribe(
      data => {
        data = JSON.parse(data);
        this.notes = data['hydra:member'];    

        this.notes.forEach(element  => {            
          let split = element.categorie.split('/');
          let id_categorie = split[split.length -1];
          
          element.category = this.categories[id_categorie].titre;
          element.color = this.categories[id_categorie].couleur;
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
  }
}
