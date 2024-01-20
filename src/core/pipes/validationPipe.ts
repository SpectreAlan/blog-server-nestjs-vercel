import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class ClassValidatorPipe extends ValidationPipe {
  public async transform(value: unknown, metadata: any): Promise<unknown> {
    const transformedValue = plainToClass(metadata.metatype, value);
    const errors = await validate(transformedValue as object, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) {
      const errorMessage = this.handleError(errors);
      throw new BadRequestException(errorMessage);
    }
    return transformedValue;
  }

  private handleError(errors: ValidationError[]): string {
    return errors
      .map((error) =>
        typeof error.constraints === 'object'
          ? error.constraints?.unknownValue || '参数格式不正确'
          : error.constraints,
      )
      .join(', ');
  }
}
