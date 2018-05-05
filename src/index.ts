export type Getter<T, U> = (target: T) => U;

export type Unwrap<T> = T extends Array<infer U> ? U : any;

export interface Constructable<T> {
  new (...args: any[]): T;
}

export type CompareFn<T> = (a: T, b: T) => number;

export class FK<T = any, U = T> {
  constructor(public $: Getter<T, U>) {}

  satisfies(callbackFn: Getter<U, boolean>) {
    const $ = this.then<boolean>(callbackFn);
    return new FK<T, boolean>($);
  }

  order(compareFn: CompareFn<U>): FS<T> {
    const $ = (ta: T, tb: T) => {
      const a: any = this.$(ta);
      const b: any = this.$(tb);
      return compareFn(a, b);
    }
    return new FS<T>($);
  }

  g<V = any>(getterFn: Getter<U, V>) {
    const $ = this.then<V>(getterFn);
    return new FK<T, V>($);
  }

  k<UKey extends keyof U>(key: UKey): FK<T, U[UKey]> {
    const $ = (t: T): U[UKey] => this.$(t)[key];
    return new FK($);
  }

  i<G = Unwrap<U>>(index: number): FK<T, G> {
    const $ = (t: T): G => (this.$(t) as any)[index] as G;
    return new FK<T, G>($);
  }

  p<G = any>(paths: string[]) {
    const $ = (t: T) => {
      return paths.reduce(
        (acc, p) => {
          return acc[p];
        },
        this.$(t) as any
      );
    };
    return new FK<T, G>($);
  }

  eq(value: any) {
    const $ = (t: T) => this.$(t) === value;
    return new FK<T, boolean>($);
  }

  gt(value: any) {
    const $ = (t: T) => this.$(t) > value;
    return new FK<T, boolean>($);
  }

  gte(value: any) {
    const $ = (t: T) => this.$(t) >= value;
    return new FK<T, boolean>($);
  }

  lt(value: any) {
    const $ = (t: T) => this.$(t) < value;
    return new FK<T, boolean>($);
  }

  lte(value: any) {
    const $ = (t: T) => this.$(t) <= value;
    return new FK<T, boolean>($);
  }

  identical(a: any) {
    const $ = (t: T) => {
      return Object.is(a, this.$(t));
    };
    return new FK<T, boolean>($);
  }

  is<G extends Constructable<any>>(Ctor: G) {
    const $ = (t: T) => {
      const val = this.$(t);
      return (val != null && val.constructor === Ctor) || val instanceof Ctor;
    };
    return new FK<T, boolean>($);
  }

  asc(): FS<T> {
    return this.order((a: U, b: U) => a < b ? -1 : a > b ? 1 : 0);
  }

  desc(): FS<T> {
    return this.order((a: U, b: U) => a > b ? -1 : a < b ? 1 : 0);
  }

  private then<V = any>(callbackFn: Getter<U, V>) {
    return (t: T) => callbackFn(this.$(t));
  }
}

export class FS<T = any> {
  constructor(public $: CompareFn<T>) {}

  then(fs: FS<T>): FS<T> {
    const $ = (ta: T, tb: T): number => {
      const r = this.$(ta, tb);
      return (r === 0) ?
        fs.$(ta, tb) :
        r;
    }
    return new FS<T>($);
  }
}

export function florida<T = any>() {
  const $ = (t: T): T => t;
  return new FK<T, T>($);
}

export function and<T>(f: FK<T, boolean>, g: FK<T, boolean>) { // both?
  const $ = (t: T): boolean => {
    return f.$(t) && g.$(t);
  };
  return new FK<T, boolean>($);
}

export function or<T>(f: FK<T, boolean>, g: FK<T, boolean>) { // either?
  const $ = (t: T): boolean => {
    return f.$(t) || g.$(t);
  };
  return new FK<T, boolean>($);
}


export function xor<T>(f: FK<T, boolean>, g: FK<T, boolean>) {
  const $ = (t: T): boolean => {
    return f.$(t) ? !g.$(t) : g.$(t);
  };
  return new FK<T, boolean>($);
}

export function not<T>(f: FK<T, boolean>) {
  const $ = (t: T): boolean => {
    return !f.$(t);
  };
  return new FK<T, boolean>($);
}
