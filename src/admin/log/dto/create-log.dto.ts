export class CreateLogDto {
  readonly ip: string;
  readonly userAgent: string;
  readonly url: string;
  readonly method: string;
  readonly query: string;
  readonly message: string;
  readonly status: number;
  readonly body: string;
}
