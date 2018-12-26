import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';

import {Exercise} from './exercise.model';

@Injectable()
export class TrainingService {
  runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  availableExercises: Exercise[];
  exercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map((docs) => {
          return docs.map((doc) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
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

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
