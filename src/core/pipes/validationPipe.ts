import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ClassValidatorPipe extends ValidationPipe {
  public async transform(value: unknown, metadata: any): Promise<unknown> {
    const transformedValue = await super.transform(value, metadata);
    const errors = await this.validate(transformedValue, {
      skipMissingProperties: true,
    });
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
