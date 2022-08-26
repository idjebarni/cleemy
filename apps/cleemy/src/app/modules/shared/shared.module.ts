import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { UserColorPipe } from './pipes/user-color.pipe';
import { UserInitialsPipe } from './pipes/user-initial.pipe';
import { StaticFilePipe } from './pipes/static-file.pipe';

const sharedPipes = [UserColorPipe, UserInitialsPipe, StaticFilePipe];
const sharedComponents = [NotFoundComponent];

@NgModule({
  declarations: [...sharedComponents, ...sharedPipes],
  imports: [CommonModule, RouterModule],
  exports: [UserColorPipe, UserInitialsPipe, StaticFilePipe],
})
export class SharedModule {}
