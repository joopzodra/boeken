export class Book {

  img = "assets/book-m.jpg";
  imgSmall = "assets/book-s.jpg";

  constructor(
    public id: number,
    public authorId: number,
    public title: string,
    public year?: number,
    public rating?: number,
    public onReadingList?: boolean,
    public owned?: boolean,
    public lentTo?: string,
    public description?: string,
    img?: string,
    imgSmall? :string,
    public authorName? : string | undefined
  ) {
    if (img) this.img = img;
    if (imgSmall) this.imgSmall = imgSmall;
  }
}
