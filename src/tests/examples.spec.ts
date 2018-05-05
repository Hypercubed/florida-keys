import { test } from 'ava';
import { and, florida } from '../index';
import { assertType } from './fixtures';

interface Person {
  first: string;
  last: string;
  dob: Date;
}

const people: Person[] = [
	{
		first: 'Graham',
		last: 'Ortiz',
		dob: new Date('9/4/1976')
	},
	{
		first: 'Gil',
		last: 'Wiggins',
		dob: new Date('8/1/1992')
	},
	{
		first: 'Curran',
		last: 'Love',
		dob: new Date('1/1/2018')
	},
	{
		first: 'Hop',
		last: 'Hanson',
		dob: new Date('5/17/1995')
	},
	{
		first: 'Owen',
		last: 'Porter',
		dob: new Date('9/22/1990')
  },
  {
		first: 'Garth',
		last: 'Nguyen',
		dob: new Date('5/26/1992')
	}
];


test('runs', t => {


  const fPeople = florida<Person>();
  const first = fPeople.k('first');
  const dob = fPeople.k('dob');

  const gNames = first.i(0).eq('G');
  const nineties = and(dob.gte(new Date('1/1/1990')), dob.lt(new Date('1/1/2000')));

  const fullname = fPeople.g(d => [d.last, d.first].join(', '));

  const dobSort = dob.asc();

  t.deepEqual(people.map(first.$), [
    'Graham',
    'Gil',
    'Curran',
    'Hop',
    'Owen',
    'Garth'
  ]);

  const p = people
    .filter(and(gNames, nineties).$)
    .sort(dobSort.$)
    .map(fullname.$);

  // $ExpectType string[]
  assertType<string[]>(p);

  t.deepEqual(people.filter(gNames.$).length, 3);
  t.deepEqual(people.filter(nineties.$).length, 4);
  t.deepEqual(
    p,
    ['Nguyen, Garth', 'Wiggins, Gil']
  );
});

test('without fk', t => {
  const first = (d: Person) => d.first;
  const nineties = (d: Person) => d.dob >= new Date('1/1/1990') && d.dob < new Date('1/1/2000');
  const gNames = (d: Person) => d.first[0] === 'G';
  const fullname = (d: Person) => `${d.last}, ${d.first}`;

  const dobSort = (a: Person, b: Person) => a.dob < b.dob ? -1 : a.dob > b.dob ? 1 : 0;

  t.deepEqual(people.map(first), [
    'Graham',
    'Gil',
    'Curran',
    'Hop',
    'Owen',
    "Garth"
  ]);

  t.deepEqual(people.filter(gNames).length, 3);
  t.deepEqual(people.filter(nineties).length, 4);
  t.deepEqual(
    people
      .filter(d => gNames(d) && nineties(d))
      .sort(dobSort)
      .map(fullname),
    ['Nguyen, Garth', 'Wiggins, Gil']
  );
});

