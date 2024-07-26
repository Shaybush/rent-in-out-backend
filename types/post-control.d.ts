export {};

declare global {
  namespace Express {
    interface Request {
      query: {
        page?: string;
      }
    }
  }
}