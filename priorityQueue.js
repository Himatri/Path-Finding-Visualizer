class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
    this._top = 0;
  }
  _parent(i) {
    return ((i + 1) >>> 1) - 1;
  }
  _left(i) {
    return (i << 1) + 1;
  }
  _right(i) {
    return (i + 1) << 1;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this._heap.length == 0;
  }
  peek() {
    return this._heap[this._top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > this._top) {
      this._swap(this._top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[this._top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > this._top && this._greater(node, this._parent(node))) {
      this._swap(node, this._parent(node));
      node = this._parent(node);
    }
  }
  _siftDown() {
    let node = this._top;
    while (
      (this._left(node) < this.size() && this._greater(this._left(node), node)) ||
      (this._right(node) < this.size() && this._greater(this._right(node), node))
    ) {
      let maxChild = (this._right(node) < this.size() && this._greater(this._right(node), this._left(node))) ? this._right(node) : this._left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

// Usage Example
// const PQ = new PriorityQueue((a, b) => a[2] < b[2]);
// PQ.push([0, 0, 1], [4, 5, 3], [6, 3, 7], [5, 8, 0], [4, 5, 0])
// while (!PQ.isEmpty()) {
//   console.log(PQ.pop());
// }
