export default class Logger {
  public static debug(text: string | null | undefined): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(text);
    }
  }
}
