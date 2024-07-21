import { ValueListFieldType } from 'remult'

@ValueListFieldType({
  getValues: () => [
    Genre.F1,
    new Genre('F2', 'Fiction: Science Fiction'),
    new Genre('F3', 'Fiction: Dystopian'),
    new Genre('F4', 'Fiction: Action & Adventure'),
    new Genre('F5', 'Fiction: Romance'),
    new Genre('F6', 'Fiction: Mystery'),
    new Genre('F7', 'Fiction: Horror'),
    new Genre('F8', 'Fiction: Thriller'),
    new Genre('F9', 'Fiction: Paranormal'),
    new Genre('F10', 'Fiction: Western'),
    new Genre('F11', 'Fiction: Literary Fiction'),
    new Genre('F12', 'Fiction: Historical Fiction'),
    new Genre('F13', 'Fiction: Contemporary Fiction'),
    new Genre('F14', 'Fiction: Magic Realism'),
    new Genre('F15', 'Fiction: LGBTQ+'),
    new Genre('F16', 'Fiction: Graphic Novel'),
    new Genre('F17', 'Fiction: Short Story'),
    new Genre('N1', 'Nonfiction: Biographies'),
    new Genre('N2', 'Nonfiction: Memoirs & Autobiographies'),
    new Genre('N3', 'Nonfiction: Food & Drink'),
    new Genre('N4', 'Nonfiction: Art & Photography'),
    new Genre('N5', 'Nonfiction: Self-Help & Motivational'),
    new Genre('N6', 'Nonfiction: History'),
    new Genre('N7', 'Nonfiction: Crafts, Hobbies & Home'),
    new Genre('N8', 'Nonfiction: Humor & Entertainment'),
    new Genre('N9', 'Nonfiction: Business & Money'),
    new Genre('N10', 'Nonfiction: Law & Criminology'),
    new Genre('N11', 'Nonfiction: Politics & Social Sciences'),
    new Genre('N12', 'Nonfiction: Religion & Spirituality'),
    new Genre('N13', 'Nonfiction: Education & Teaching'),
    new Genre('N14', 'Nonfiction: Travel'),
    new Genre('N15', 'Nonfiction: True Crime'),
    new Genre('N16', 'Nonfiction: Poetry')
  ]
})
export class Genre {
  constructor(public id: string, public caption: string) {}
  static F1 = new Genre('F1', 'Fiction: Fantasy')
}
