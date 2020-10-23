import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/_common/global-constants';
import { Categorie } from 'src/app/_models/categorie.model';
import { CategorieService } from 'src/app/_services/categorie/categorie.service';
import { NoteService } from 'src/app/_services/note/note.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-notes-edit',
  templateUrl: './notes-edit.component.html',
  styleUrls: ['./notes-edit.component.css']
})
export class NotesEditComponent implements OnInit {

  // A partir du backend
  categories: Categorie[] = [];

  // Pagination
  p: number = 1;
  
  idNote: number;
  note: any = {};  

  // Form
  noteForm :  FormGroup;
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private categorieService: CategorieService,
              private noteService: NoteService,
              private fb: FormBuilder,
              private tokenStorageService: TokenStorageService) { 

  }

  ngOnInit(): void {
    this.initializeForms();

    // Note en cours
    this.idNote = +this.route.snapshot.paramMap.get('id');
    this.getNote(); 
  }

  initializeForms(): void {
    this.noteForm = this.fb.group({
      titre: ['', Validators.required],
      categories: ['', Validators.required],
      description: ['', Validators.required]      
    });
  }

  save() {

    let id_categorie = this.noteForm.get('categories').value;

    if (id_categorie > 0) {
      let newTitre = this.noteForm.value.titre;      
      let newCategorie = id_categorie;
      let newDescription = this.noteForm.value.description;

      // Get current user
      let currentUser = this.tokenStorageService.getUser();

      // Current date of update
      let ts = new Date();

      // Json
      let newNote = {
        "titre"     :  newTitre,
        "contenu"   : newDescription,
        "categorie" : '/api/categories/' + newCategorie,
        "updatedAt" : ts.toJSON(),
        "modifId"   : currentUser.id
      }      

      // Post request
      this.noteService.setNote(this.idNote, newNote).subscribe(
        data => {
          this.router.navigate(['notes']);
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  getNote(): void {

    // Set Global Categories
    this.categorieService.getCategories()
      .subscribe(categorieResponse => {
        GlobalConstants.allCategories = JSON.parse(categorieResponse);        

        // Set local categories for <select></select>
        GlobalConstants.allCategories['hydra:member'].forEach(element => {
          this.categories.push({id: element.id, titre: element.titre, couleur: element.couleur, icone: element.icone});
        });
    });

    // Get Note by id
    this.noteService.getNote(this.idNote)
      .subscribe(noteResponse => {
        this.note = JSON.parse(noteResponse);  
        
        let split = this.note.categorie.split('/');
        let id_categorie = split[split.length -1];        
        
        this.categories.forEach(element => {

          if (element.id == id_categorie) {    
            
            this.noteForm.patchValue({
              titre: this.note.titre,
              description: this.note.contenu,
              categories: [this.categories]
            });
            this.noteForm.controls['categories'].setValue(element.id, {onlySelf: true});            
          }          
        });

    });     
  }

  deleteNote(id) : void
  {
    try {
      this.noteService.delete(id);  
    } catch (error) {
      
    }
    
    this.router.navigate(['notes']);
  }

}
