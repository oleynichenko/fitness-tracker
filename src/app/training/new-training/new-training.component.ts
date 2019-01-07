import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {
  exercises: Exercise[];
  exerciseSubscription: Subscription;
  isLoading = true;
  loadingSubs: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      }
    );

    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe((exercises) => {
        this.exercises = exercises;
      }
    );

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }

    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
