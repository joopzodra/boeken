export class XmlTextFinder {
  el: any;
  constructor(private work: any) {
    this.el = work;
  }
  find(el: string) {
    this.el = this.el.getElementsByTagName(el).item(0);
    return this;
  }
  text() {
    return this.el.textContent;
  }
}
