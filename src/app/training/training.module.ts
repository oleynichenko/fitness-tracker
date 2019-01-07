import {NgModule} from '@angular/core';

import {PastTrainingsComponent} from './past-trainings/past-trainings.component';
import {TrainingComponent} from './training/training.component';
import {NewTrainingComponent} from './new-training/new-training.component';
import {CurrentTrainingComponent} from './current-training/current-training.component';
import {StopTrainingComponent} from './stop-training.component';
import {SharedModule} from '../shared/shared.module';
import {TrainingRoutingModule} from './training-routing.module';

@NgModule({
  declarations: [
    PastTrainingsComponent,
    NewTrainingComponent,
    CurrentTrainingComponent,
    TrainingComponent,
    StopTrainingComponent,
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule {}
