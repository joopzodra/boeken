export const stubGoodReadsSearchResponse = `<?xml version="1.0" encoding="UTF-8"?>
<GoodreadsResponse>
<search>
<results>
<work>
<original_publication_year type="integer">1860</original_publication_year>
<best_book type="Book">
<id type="integer">1</id>
<title>Book#1</title>
<author>
<id type="integer">10</id>
<name>Author#10</name>
</author>
<image_url>https://images.gr-assets.com/books/1463255046m/326280.jpg</image_url>
<small_image_url></small_image_url>
</best_book>
</work>
<work>
<original_publication_year type="integer">1987</original_publication_year>
<best_book type="Book">
<id type="integer">2</id>
<title>Book#2</title>
<author>
<id type="integer">10</id>
<name>Author#10</name>
</author>
<image_url>https://images.gr-assets.com/books/1390834503m/1005224.jpg</image_url>
<small_image_url></small_image_url>
</best_book>
</work>
<work>
<original_publication_year type="integer" nil="true"/>
<best_book type="Book">
<id type="integer">3</id>
<title>Book#3</title>
<author>
<id type="integer">30</id>
<name>Author#30</name>
</author>
<image_url>https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png</image_url>
<small_image_url></small_image_url>
</best_book>
</work>
</results>
</search>
</GoodreadsResponse>`

export const stubGoodReadsBookResponse = 
`<?xml version="1.0" encoding="UTF-8"?>
<GoodreadsResponse>
<book>
<id>1</id>
<title>
Book#1
</title>
<image_url></image_url>
<small_image_url></small_image_url>
<original_publication_year>1997</original_publication_year>
<description>Description#1</description>
</book>
</GoodreadsResponse>`

export const stubGoodReadsAuthorResponse = 
`<?xml version="1.0" encoding="UTF-8"?>
<GoodreadsResponse>
<author>
<name>Author#10</name>
<image_url></image_url>
<small_image_url></small_image_url>
</author>
</GoodreadsResponse>`
