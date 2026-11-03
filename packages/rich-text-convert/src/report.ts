/** Collects what a conversion could not carry over, counting repeats so a long document gives a short list. */
export class Report {
  private counts = new Map<string, number>();

  warn(message: string): void {
    this.counts.set(message, (this.counts.get(message) ?? 0) + 1);
  }

  get warnings(): string[] {
    return Array.from(this.counts, ([message, count]) => (count > 1 ? `${message} (${count} times)` : message));
  }
}
