import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss']
})
export class RecipesPage implements OnInit, OnDestroy {
  recipes: Recipe[];
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    console.log(this.recipes);
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.recipes = this.recipeService.getAllRecipes();
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }
  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }
  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
