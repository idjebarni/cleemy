import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userInitials' })
export class UserInitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';

    const fullNameArray = name.split(' ');
    const fullName = { firstName: fullNameArray[0], lastname: fullNameArray[1] };

    return (fullName.firstName[0] + fullName.lastname[0]).toUpperCase();
  }
}
