export class Author {

  img = "assets/person-m.jpg";
  imgSmall = "assets/person-s.jpg";

  constructor(
     public id: number,
     public name: string,
     img?: string,
     imgSmall?: string
  ) {

    if (img) this.img = img;
    if (imgSmall) this.imgSmall = imgSmall;  
  }
}
