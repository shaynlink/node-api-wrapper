import { dataTypeChecker } from 'tychecker';

export class Collection<K , V> extends Map<K | symbol, V | [RegExp, V][]> {
    public regexSbl: symbol;
    constructor(entries: [K, V][] = []) {
        const regexSbl = Symbol('regex');
        super([
            [regexSbl, []],
            ...entries
        ]);

        this.regexSbl = regexSbl;
    }

    get(key: any): V | undefined {
        if (this.hasKey(key, {ignoreRegex: true})) {
            return super.get(key) as V | undefined;
        } else if (dataTypeChecker(key, 'string')) {
            const regx = super.get(this.regexSbl) as [RegExp, V][];
            
            if (!regx) return;
            
            const pair = regx.find(([k]) => k.test(key));

            if (!pair) return;

            return pair[1];
        }
    }

    hasKey(key: any, opt?: {ignoreRegex: boolean}): boolean {
        if (opt?.ignoreRegex) {
            return super.has(key);
        } else {
            if (super.has(key)) {
                return true;
            }

            const regx = this.get(this.regexSbl) as [RegExp, V][];

            if (!regx) {
                return false;
            }

            return regx.some(([k]) => k.test(key));
        }
    }

    set(key: any, value: any) {
        if (dataTypeChecker(key, 'regex')) {
            const pair = this.get(this.regexSbl) as [RegExp, V][];

            if (!pair) {
                super.set(key, value);
                return this;
            } 

            pair.push([key, value]);
            return this;
        } else {
            super.set(key, value);
            return this;
        }
    }
}