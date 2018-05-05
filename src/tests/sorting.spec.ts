import { test } from 'ava';
import { florida } from '../index';

function assertType<T>(_: T): T {
  return _;
}

interface Person {
  firstname: string;
  lastname: string;
  age: number;
}

const people: Person[] = [
  { firstname: 'John', lastname: 'Smith', age: 51 },
  { firstname: 'John', lastname: 'Hawley', age: 16 },
  { firstname: 'Janet', lastname: 'Howell', age: 23 },
  { firstname: 'John', lastname: 'Jones', age: 29 },
  { firstname: 'John', lastname: 'Hernandez', age: 22 },
  { firstname: 'Maurice', lastname: 'Hall', age: 22 }
];

const fkPerson = florida<Person>();

test('return ascending order', t => {
  const age = fkPerson.k('age');
  const order = age.desc();
  const r = people.sort(order.$);

  // $ExpectType Person[]
  assertType<Person[]>(r);
  t.deepEqual(r.map(age.$), [51, 29, 23, 22, 22, 16]);
});

test('return decending order', t => {
  const age = fkPerson.k('age');
  const order = age.asc();
  const r = people.sort(order.$);

  // $ExpectType Person[]
  assertType<Person[]>(r);
  t.deepEqual(r.map(age.$), [16, 22, 22, 23, 29, 51]);
});

test('return custom order', t => {
  const lastname = fkPerson.k('lastname');
  const order = lastname.order((a, b) => {
    return b.length - a.length;
  });
  const r = people.sort(order.$);

  // $ExpectType Person[]
  assertType<Person[]>(r);
  t.deepEqual(r.map(lastname.$), [
    'Hernandez',
    'Hawley',
    'Howell',
    'Jones',
    'Smith',
    'Hall'
  ]);
});
