import { test } from 'ava';
import { and, florida, not, or, xor } from '../index';
import { assertType, azusa, john, Person } from './fixtures';

const fkPerson = florida<Person>();

test('and', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  const r = and(namedNakanoAzuza, teen).$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.true(r);
  t.false(and(namedNakanoAzuza, teen).$(john));
});

test('or', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  const r = or(namedNakanoAzuza, teen).$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.true(r);
  t.false(or(namedNakanoAzuza, teen).$(john));
});

test('xor', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  const r = xor(namedNakanoAzuza, teen).$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.false(r);
  t.false(xor(namedNakanoAzuza, teen).$(john));
});


test('not', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  const r = not(and(namedNakanoAzuza, teen)).$(azusa);

  // $ExpectType boolean
  assertType<boolean>(r);

  t.false(r);
  t.true(not(and(namedNakanoAzuza, teen)).$(john));
});