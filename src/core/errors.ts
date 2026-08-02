export class SwimApiError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.name = 'SwimApiError';
  }
}

export class SwimNetworkError extends SwimApiError {
  constructor(message: string) {
    super(message);
    this.name = 'SwimNetworkError';
  }
}

export class SwimRateLimitError extends SwimApiError {
  constructor(message: string) {
    super(message, 429);
    this.name = 'SwimRateLimitError';
  }
}
