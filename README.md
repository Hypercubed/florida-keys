# florida-keys

Pure functional accessor factories in TypeScript.

# Install

```bash
npm install florida-keys
```

# Testing

```bash
npm install
npm test
```

# Summary of API

```ts
// import a factory function and accesssory functions from florida-keys
import { florida, and } from 'florida-keys';

// This is the type of data we want to access, filter and sort
interface Person {
  first: string;
  last: string;
  dob: Date;
}

// create a florida-keys accessor for a Person type
const f = florida<Person>();

// define some accessor functions
const first = f.k('first');
const dob = f.k('dob');
const fullname = f.g(d => `${d.last}, ${d.first}`);

// define some conditions
const gNames = first.i(0).eq('G');
const nineties = and(
  dob.gte(new Date('1/1/1990')),
  dob.lt(new Date('1/1/2000'))
);

// define a sorting function
const dobSort = dob.asc();

// The data
const people: Person[] = [
  { first: 'Gil', last: 'Wiggins', dob: new Date('8/1/1992') },
  ...
];

// returns an array
people
  .filter(and(gNames, nineties).$) // people with "G" names born in the 90's
  .sort(dobSort.$)                 // sorted by date of birth
  .map(fullname.$);                // their fullnames
```

### Accessors

| F                        | Equivalent 
| ------------------------ | ----------------------- |
| `f.$`                    | `(d: T) => d`           |
| `f.k('key').$`           | `(d: T) => d.key`       |
| `f.k('key').k('key').$`  | `(d: T) => d.key.key`   |
| `f.i(index).$`           | `(d: T) => d[number]`   |
| `f.g(fn).$`              | `(d: T) => fn(d)`       |

_Example_

```ts
const f = florida<Person>();
const first = f.k('first');

people
  .map(first.$);  // Returns a list of first names
```

### Operators

| FK               | Equivalent                          |
| ---------------- | ----------------------------------- |
| `f.eq(value).$`  | `(d: T): boolean => d == value` |
| `f.gt(value).$`  | `(d: T): boolean => d >  value` |
| `f.lt(value).$`  | `(d: T): boolean => d <  value` |
| `f.gte(value).$` | `(d: T): boolean => d >= value` |
| `f.lte(value).$` | `(d: T): boolean => d <= value` |

_Example_

```ts
const f = florida<Person>();
const firstname = f.k('firstname');
const gills = firstname.eq('Gil');

people
  .filter(gills.$);  // returns a list of Gil's
```

### Logicals

| FK                         | Equivalent                       |
| -------------------------- | -------------------------------- |
| `not(f.eq(a)).$`           | `(d: T) => !(d === a)`           |
| `and(f.eq(a), f.lt(b)).$`  | `(d: T) => (d === a) && (d < b)` |
| `or(f.eq(a), f.lt(b)).$`   | `(d: T) => (d === a) || (d < b)` |

_Example_

```ts
const f = florida<Person>();
const dob = f.k('dob');
const nineties = and(
  dob.gte(new Date('1/1/1990')),
  dob.lt(new Date('1/1/2000'))
);

people
  .filter(nineties.$);  // returns a list of people born in the nineties
```

### Sorting

| FK                 | Equivalent
| ------------------ | ----------------------------------------- |
| `f.order(fn).$`    | `(a: T, b: T): number => fn(a, b)`        |
| `f.asc().$`        | `(a: T, b: T): number => ascending(a, b)` |
| `f.desc().$`       | `(a: T, b: T): number => decending(a, b)` |

_Example_

```ts
const f = florida<Person>();
const dobSort = f.k('dob').asc();

people
  .sort(dobSort.$);  // returns a list of people sorted by date of birth in ascending order
```

### Why?

In TypeScript we often write accessor functions like this:

```ts
function(d: Person) { return d.first; }
```

or using arrow functions

```ts
(d: Person) => d.first
```

This simple function returns the value of the `first` key when an object is pass to it.  For example in the `map` function:

```ts
people.map((d: Person) => d.first);
```

This is lightweight, simple, and readable.  There is nothing wrong with it.  Sometimes, however, in order to avoid repeating ourselves so we create a reusable accessor function like this:

```ts
const firstname = (d: Person) => d.first;
people.map(firstname);
```

Now imagine the object also has a `dob` key whose values are date objects.  We may want to filter like this:

```ts
const firstname = (d: Person) => d.first;
const dob = (d: Person) => d.dob;
const dobFilter = (d: Person) => d.dob >= new Date('1/1/1990');

people
  .filter(dobFilter)
  .map(firstname);
```

However, this has a couple of drawbacks.  First of all, you will need to create a new filter every time the date changes; also the `Date` constructor is called for every element in the `people` array.  A better approach is an accessor function factory:

```ts
const createDobFilter = (date: Date) => d => d.dob >= date;
const dobFilter = createDobFilter(new Date('1/1/1990'));

people
  .filter(dobFilter)
  .map(firstname);
```

It's a little ugly but here the `Date` constructor is only called once and the `createDobFilter` function returns the accessor.  An new accessor can be created any time by calling `createDobFilter`

Now what if we want to filter between two dates.  We can do modify our accessor factory:

```ts
const createDobFilter = (a: Date, b: Date) => d => d.dob >= a && d.dob < b;
```

but let's say that you have multidimensional data where dates `a` and `b` change independently.  You might be tempted to do something like this:

```ts
const createDobGteFilter = (date: Date) => d => d.dob >= date;
const createDobLteFilter = (date: Date) => d => d.dob < date;

const dobGteFilter = createDobGteFilter(new Date('1/1/1990'));
const dobLteFilter = createDobLteFilter(new Date('1/1/2000'));

const values = data
  .filter(dobGteFilter)
  .filter(dobLteFilter)
  .map(firstname);
```

Then let's add sorting by dob and returning the person's full name.

```ts
const createDobGteFilter = (date: Date) => d => d.year >= date;
const createDobLteFilter = (date: Date) => d => d.year < date;

const dob = (d: Person) => d.dob;
const dobGteFilter = createDobGteFilter(new Date('1/1/1990'));
const dobLteFilter = createDobLteFilter(new Date('1/1/2000'));
const fullname = (d: Person) => `${d.last}, ${d.first}`;

const dobSort = (a: Person, b: Person) => a.dob < b.dob ? -1 : a.dob > b.dob ? 1 : 0;

people
  .filter(dobGteFilter)
  .filter(dobLteFilter)
  .sort(dobSort)
  .map(fullname);
```

Ok, no we're getting ridiculous.  The `Date` constructor is not that expensive.  But you can imagine a situation where the values for filters could be very expensive.  For example based on aggregated statistics or reading from the DOM, or, perhaps, we are interating over a lot of data

Ok, at this point let me introduce `florida-keys`.  `florida-keys` has simply a set of shortcuts for all this.  For example:

```ts
const f = florida<Person>();
const firstname = f.k('first');
people.map(firstname.$);
```

The value returned from `f.k(key).$` in this case is simply the typed accessor function `function(d: T) { return d[key]; }`.

Interesting.  How about this:

```ts
const f = florida<Person>();
const firstname = f.k('first');
const dobFilter = f.k('dob').gte(new Date('1/1/1990'));
people
  .filter(dobFilter.$)
  .map(firstname.$);
```

`f.k(key).gte(somevalue)` is essentially a shortcut for `function(d: T) { return d['key'] >= somevalue; }`.

It gets better:

```ts
const f = florida<Person>();
const firstname = f.k('first');
const dob = f.k('dob');

const nineties = and(
  dob.gte(new Date('1/1/1990')),
  dob.lt(new Date('1/1/2000'))
);

people
  .filter(nineties.$)
  .map(firstname.$);
```

or how about this:

```ts
const f = florida<Person>();
const firstname = f.k('first');
const dob = f.k('dob');
const fullname = f.g(d => `${d.last}, ${d.first}`);

const gNames = firstname.i(0).eq('G');
const nineties = and(
  dob.gte(new Date('1/1/1990')),
  dob.lt(new Date('1/1/2000'))
);

const filter = and(gNames, nineties);
const sort = dob.asc();

people
  .filter(filter.$)
  .sort(sort.$)
  .map(fullname.$);
```

Pretty neat?

## Acknowledgments

Also see [utatti/lens.ts](https://github.com/utatti/lens.ts)

## License
Copyright (c) 2014+ Jayson Harshbarger
MIT