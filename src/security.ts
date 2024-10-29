export class Security {
  static get secret() {
    //Comment explaining is in the .env file
    return process.env.JWT_SECRET || 'No secret set...';
  }
}
