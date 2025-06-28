import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseBoolPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }

    throw new BadRequestException(
      `Validation failed (boolean string is expected)`,
    );
  }
}
