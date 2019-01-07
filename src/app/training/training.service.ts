import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';

import {Exercise} from './exercise.model';
import {UiService} from '../shared/ui.service';

@Injectable()
export class TrainingService {
  runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  availableExercises: Exercise[];

  constructor(private db: AngularFirestore,
              private uiService: UiService) {}

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map((docs) => {
          return docs.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            } as Exercise;
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
        this.uiService.loadingStateChanged.next(false);
      }, () => {
        this.exercisesChanged.next(null);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar('Fetching failed. Try again.', null, 3000)
      }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find((ex) => {
      return ex.id === selectedId;
    });

    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      state: 'completed',
      date: new Date()
    });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress) {
    this.addDataToDatabase({
      ...this.runningExercise,
      calories: this.runningExercise.calories * (progress / 100),
      duration: this.runningExercise.duration * (progress / 100),
      state: 'cancelled',
      date: new Date()
    });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  private addDataToDatabase(exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }
}
