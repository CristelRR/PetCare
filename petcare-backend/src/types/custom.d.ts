declare module "speakeasy";
declare module "qrcode";


declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
