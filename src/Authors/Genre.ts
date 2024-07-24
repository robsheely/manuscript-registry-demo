import { ValueListFieldType } from 'remult'

@ValueListFieldType({
  getValues: () => [
    Genre.F1,
    new Genre('F2', 'Fic: SciFi'),
    new Genre('F3', 'Fic: Dystopian'),
    new Genre('F4', 'Fic: Action/Adventure'),
    new Genre('F5', 'Fic: Romance'),
    new Genre('F6', 'Fic: Mystery'),
    new Genre('F7', 'Fic: Horror'),
    new Genre('F8', 'Fic: Thriller'),
    new Genre('F9', 'Fic: Paranormal'),
    new Genre('F10', 'Fic: Western'),
    new Genre('F11', 'Fic: Literary'),
    new Genre('F12', 'Fic: Historical'),
    new Genre('F13', 'Fic: Commercial'),
    new Genre('F14', 'Fic: Magic Realism'),
    new Genre('F15', 'Fic: LGBTQ+'),
    new Genre('F16', 'Fic: Graphic Novel'),
    new Genre('F17', 'Fic: Short Story'),
    new Genre('N1', 'Nonfic: Biographies'),
    new Genre('N2', 'Nonfic: Memoirs/Autobiographies'),
    new Genre('N3', 'Nonfic: Food & Drink'),
    new Genre('N4', 'Nonfic: Art & Photography'),
    new Genre('N5', 'Nonfic: Self-Help & Motivational'),
    new Genre('N6', 'Nonfic: History'),
    new Genre('N7', 'Nonfic: Crafts, Hobbies & Home'),
    new Genre('N8', 'Nonfic: Humor & Entertainment'),
    new Genre('N9', 'Nonfic: Business & Money'),
    new Genre('N10', 'Nonfic: Law & Criminology'),
    new Genre('N11', 'Nonfic: Politics & Social Sciences'),
    new Genre('N12', 'Nonfic: Religion & Spirituality'),
    new Genre('N13', 'Nonfic: Education & Teaching'),
    new Genre('N14', 'Nonfic: Travel'),
    new Genre('N15', 'Nonfic: True Crime'),
    new Genre('N16', 'Nonfic: Poetry')
  ]
})
export class Genre {
  constructor(public id: string, public caption: string) {}
  static F1 = new Genre('F1', 'Fic: Fantasy')
}
