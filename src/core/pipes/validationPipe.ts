import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class ClassValidatorPipe extends ValidationPipe {
  public async transform(value: any, metadata: any): Promise<unknown> {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    const transformedValue = plainToClass(metadata.metatype, value);
    const errors = await validate(transformedValue as object, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      const errorMessage = this.handleError(errors);
      throw new BadRequestException(errorMessage);
    }
    return transformedValue;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  private handleError(errors: ValidationError[]): string {
    return errors
      .map((error) =>
        typeof error.constraints === 'object'
          ? Object.values(error.constraints) || '参数格式不正确'
          : error.constraints,
      )
      .join(', ');
  }
}
