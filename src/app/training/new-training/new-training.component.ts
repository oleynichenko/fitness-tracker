import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe((exercises) => {
        this.exercises = exercises;
      }
    );

    this.trainingService.fetchAvailableExercises();
  }

  onStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
