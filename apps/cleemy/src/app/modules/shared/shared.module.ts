import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EllipsisPipe } from './pipes/ellipsis.pipe';

@NgModule({
  declarations: [EllipsisPipe],
  imports: [CommonModule, RouterModule],
  exports: [EllipsisPipe],
})
export class SharedModule {}
