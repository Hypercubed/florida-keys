import { test } from 'ava';
import { and, florida, not, or, xor } from '../index';
import { azusa, john, Person } from './fixtures';

const fkPerson = florida<Person>();

test('and', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  t.true(and(namedNakanoAzuza, teen).$(azusa));
  t.false(and(namedNakanoAzuza, teen).$(john));
});

test('or', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  t.true(or(namedNakanoAzuza, teen).$(azusa));
  t.false(or(namedNakanoAzuza, teen).$(john));
});

test('xor', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  t.false(xor(namedNakanoAzuza, teen).$(azusa));
  t.false(xor(namedNakanoAzuza, teen).$(john));
});


test('not', t => {
  const namedNakanoAzuza = fkPerson.k('name').eq('Nakano Azusa');
  const age = fkPerson.k('age');
  const teen = and(age.gte(13), age.lte(19));

  t.false(not(and(namedNakanoAzuza, teen)).$(azusa));
  t.true(not(and(namedNakanoAzuza, teen)).$(john));
});