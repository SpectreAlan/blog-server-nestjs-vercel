import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class ClassValidatorPipe extends ValidationPipe {
  public async transform(value: unknown, metadata: any): Promise<unknown> {
    const transformedValue = plainToClass(metadata.metatype, value);
    console.log(transformedValue);
    const errors = await validate(transformedValue as object, {
      skipMissingProperties: true,
    });
    console.log(errors);
    if (errors.length > 0) {
      const errorMessage = this.handleError(errors);
      throw new BadRequestException(errorMessage);
    }
    return transformedValue;
  }

  private handleError(errors: ValidationError[]): string {
    const errorMessage = errors.map((error) => error.constraints).join(', ');
    return errorMessage;
  }
}
