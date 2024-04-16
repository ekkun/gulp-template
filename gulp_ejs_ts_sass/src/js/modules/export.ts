export function test(): void {
  window.addEventListener('click', () => {
    const heading1: HTMLElement = <HTMLElement>document.querySelector('h1');
    console.log(heading1);
  });
}
