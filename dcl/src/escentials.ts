//### COLLECTIONS ###
//pre-edit source: Dominik Marciniszyn, codetain.com
/**  */
export class List<T> {
    /** all items managed by collection */
    private items: Array<T>;
    
    //initialization
    constructor() { this.items = []; }

    /** returns the total number of all items */
    size():number { return this.items.length; }

    /** adds the given item to the list */
    addItem(value:T):void { this.items.push(value); }

    /** assigns the given item to the given position */
    assignItem(pos: number, instance: T) { this.items[pos] = instance; }

    /** returns the item at the given index */
    getItem(index:number):T { return this.items[index]; }

    /** returns positional index of the given element in the array,
     * if the element does exist returns '-1'
     */
    getItemPos(value: T): number {
        //process all items
        var i: number = 0;
        while (i < this.items.length) {
            //if item is found
            if (this.items[i] == value)  return i;
            //force next case
            i++;
        }
        return -1;
    }

    /** removes the given element from the list (if the element exists),
     *  maintaining the order of elements
     *  (uses push-forward/can-kicker technique, so doesn't matter if the item exists)
     */
    removeItem(value: T): void {
        //shift selected element to last spot in array
        var i: number = 0;
        var tmp: T;
        while (i < this.items.length) {
            //if end of list
            if (i == this.items.length - 1) {
                this.items.pop();
                return;
            }

            //if item is found
            if (this.items[i] == value) {
                //swap targeted element with next element in list
                tmp = this.items[i];
                this.items[i] = this.items[i + 1];
                this.items[i + 1] = tmp;
            }
            //force next case
            i++;
        }
    }
}
/**  */
export class Dictionary<T> {
    /** all items managed by collection, access via string */
    private items: { [index: string]: T } = {};
    /** total number of elements in the dictionary */
    private count: number = 0;

    size(): number {
        return this.count;
    }

    getKeys(): string[] {
        let keySet: string[] = [];

        for (let property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                keySet.push(property);
            }
        }

        return keySet;
    }

    containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    addItem(key: string, value: T): undefined {
        if (!this.items.hasOwnProperty(key)) {
            this.count++;
        }

        this.items[key] = value;
        return;
    }

    getItem(key: string): T {
        return this.items[key];
    }

    removeItem(key: string): T {
        let value = this.items[key];

        delete this.items[key];
        this.count--;

        return value;
    }

    values(): T[] {
        let values: T[] = [];

        for (let property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                values.push(this.items[property]);
            }
        }

        return values;
    }
}