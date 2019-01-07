import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit,  OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.trainingService.fetchCompletedOrCancelledExercises();

    this.exChangedSubscription = this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
        console.log(exercises);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe();
    }
  }
}
