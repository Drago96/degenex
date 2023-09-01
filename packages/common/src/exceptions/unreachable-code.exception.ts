export class UnreachableCodeException extends Error {
  constructor() {
    super('Unreachable code has been invoked.');
  }
}
