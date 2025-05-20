import { Routes } from '@angular/router';
import { TrainingComponent } from './pages/training/training.component';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';
import { DecksComponent } from './pages/decks/decks.component';
import { DeckComponent } from './pages/deck/deck.component';

export const routes: Routes = [
  { path: '', redirectTo: '/training', pathMatch: 'full' },
  { path: 'training', component: TrainingComponent },
  { path: 'scheduler', component: SchedulerComponent },
  { path: 'decks', component: DecksComponent },
  { path: 'decks/:deckId', component: DeckComponent }
];
