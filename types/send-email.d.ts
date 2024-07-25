export {};

declare global {
  namespace Express {
    interface Request {
      _id: string;
      asd: string;
    }
  }
}