import { test } from 'ava';
import { florida } from '../index';
import { azusa, Person } from './fixtures';

function assertType<T>(_: T): T {
  return _;
}

const fkPerson = florida<Person>();

test('identical', t => {
  const isAzuza = fkPerson.identical(azusa);
  const r = isAzuza.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);
  t.true(r);
});

test('equal', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const r = namedNakanoAzuza.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);
  t.true(r);
});

test('is', t => {
  const isPerson = fkPerson.is(Person);
  const r = isPerson.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);
  t.true(r);
});

test('satisfies', t => {
  const namedNakanoAzuza = fkPerson
    .k('name')
    .satisfies(d => d === 'Nakano Azusa');
  const r = namedNakanoAzuza.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);
  t.true(r);
});
