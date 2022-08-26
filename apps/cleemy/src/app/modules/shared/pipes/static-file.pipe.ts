import { isDevMode, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'static' })
export class StaticFilePipe implements PipeTransform {
  transform(value: string): string {
    if (!isDevMode()) {
      return 'https://idjebarni.github.io/convelio' + value;
    } else {
      return value;
    }
  }
}
