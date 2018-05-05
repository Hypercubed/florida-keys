import { test } from 'ava';
import { florida } from '../index';
import { assertType, azusa, Person } from './fixtures';

const fkPerson = florida<Person>();

test('lt', t => {
  const age = fkPerson.k('age');

  t.true(age.lt(100).$(azusa));
  t.false(age.lt(15).$(azusa));
  t.false(age.lt(10).$(azusa));
});

test('lte', t => {
  const age = fkPerson.k('age');

  t.true(age.lte(100).$(azusa));
  t.true(age.lte(15).$(azusa));
  t.false(age.lte(10).$(azusa));
});

test('gt', t => {
  const age = fkPerson.k('age');

  t.false(age.gt(100).$(azusa));
  t.false(age.gt(15).$(azusa));
  t.true(age.gt(10).$(azusa));
});

test('gte', t => {
  const age = fkPerson.k('age');

  t.false(age.gte(100).$(azusa));
  t.true(age.gte(15).$(azusa));
  t.true(age.gte(10).$(azusa));
});

test('identical', t => {
  const isAzuza = fkPerson.identical(azusa);
  const r = isAzuza.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.true(r);
});

test('identical numbers', t => {
  const anything = florida<number>();
  
  t.true(anything.identical(-0).$(-0));
  t.false(anything.identical(-0).$(0));

  t.true(anything.identical(Infinity).$(Infinity));
  t.true(anything.identical(-Infinity).$(-Infinity));
  t.false(anything.identical(-Infinity).$(Infinity));

  t.true(anything.identical(NaN).$(NaN));
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

test('is not', t => {
  class NotPerson {

  }

  const isPerson = fkPerson.is(NotPerson);
  const r = isPerson.$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.false(r);
});

test('is instance', t => {
  class AlsoPerson extends Person {

  }

  const alsoPerson = new AlsoPerson({...azusa});

  const isPerson = fkPerson.is(Person);
  const r = isPerson.$(alsoPerson);

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
