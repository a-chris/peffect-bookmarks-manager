export default function log(text: string | null | undefined): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(text);
  }
}
