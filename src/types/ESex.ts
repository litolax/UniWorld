export enum ESex {
  None = -1,
  Male,
  Female,
}

export const getSexFromString = (sex: string): ESex => {
  switch (sex.toLowerCase()) {
    case 'male':
      return ESex.Male
    case 'female':
      return ESex.Female
  }

  return ESex.None
}
