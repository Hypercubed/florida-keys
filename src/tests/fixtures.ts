export interface Account {
  id?: number;
  type: string;
  handle: string;
}

export class Person {
  name: string = '';
  age: number = 0;
  primary: Account = {
    id: 0,
    type: '',
    handle: ''
  };
  accounts: Account[] = [];

  constructor(person: any) {
    Object.assign(this, person);
  }
}

export const azusa = new Person({
  name: 'Nakano Azusa',
  age: 15,
  primary: {
    id: 10,
    type: 'twitter',
    handle: '@azusa'
  },
  accounts: [
    {
      type: 'twitter',
      handle: '@azusa'
    },
    {
      type: 'facebook',
      handle: 'nakano.azusa'
    }
  ]
});

export const john = new Person({
  name: 'John Smith',
  age: 32
});
