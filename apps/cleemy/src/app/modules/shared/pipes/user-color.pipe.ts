import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userColor',
})
export class UserColorPipe implements PipeTransform {
  palette: Array<string> = [
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
  ];

  transform(userId: number): string {
    if (!this.palette[userId - 1]) {
      return this.palette[0];
    }
    return this.palette[userId - 1];
  }
}
