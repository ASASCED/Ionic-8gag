import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholder'
})
export class PlaceholderPipe implements PipeTransform {

  transform(value: string, args: string = 'Sin titulo'): string {
    return (value) ? value : args;
  }

}
