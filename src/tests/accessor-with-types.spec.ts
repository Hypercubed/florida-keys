import { test } from 'ava';
import { florida } from '../index';
import { Account, assertType, azusa, Person } from './fixtures';

const fkPerson = florida<Person>();

test('return self', t => {
  const r = fkPerson.$(azusa);

  // $ExpectType Person
  assertType<Person>(r);

  t.deepEqual(r, azusa);
});

test('return by key', t => {
  const name = fkPerson.k('name');
  const r = name.$(azusa);

  // $ExpectType string
  assertType<string>(r);

  t.deepEqual(r, 'Nakano Azusa');
});

test('return by key nested', t => {
  const primaryId = fkPerson.k('primary').k('id');
  const r = primaryId.$(azusa);

  // $ExpectType number | undefined
  assertType<number | undefined>(r);

  t.deepEqual(r, 10);
});

test('return by index', t => {
  const firstAccount = fkPerson.k('accounts').i(0);
  const r = firstAccount.$(azusa);

  // $ExpectType Account
  assertType<Account>(r);

  t.deepEqual(r.type, 'twitter');
});

test('return by compose', t => {
  const age = fkPerson.g(d => d.age);
  const r = age.$(azusa);

  // $ExpectType number
  assertType<number>(r);

  t.deepEqual(r, 15);
});

test('return by compose nested', t => {
  const primaryId = fkPerson.k('primary').g(d => d.id);
  const r = primaryId.$(azusa);

  // $ExpectType number | undefined
  assertType<number | undefined>(r);

  t.deepEqual(r, 10);
});

test('return by path', t => {
  const primaryId = fkPerson.p<number>(['primary', 'id']);
  const r = primaryId.$(azusa);

  // $ExpectType number
  assertType<number>(r);

  t.deepEqual(r, 10);
});
