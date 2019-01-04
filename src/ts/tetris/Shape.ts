export default class Shape {
  // position of shape box. left-top 20 * 10
  public position = [-1, 5] as number[]; // [row, col]

  // color of the two box
  // red 1 orange 2 green 3 blue 4 purple 5 pink 6
  // [center other]
  public color = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] as number[];

  public index = 0; // 0 1 2 3

  // 010  => 000 010 000 000
  // 111  => 110 010 011 010
  // 010  => 000 000 000 010
  private shapes = {
    0: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    1: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    2: [
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    3: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]
  };

  constructor(index: number | null, pos: number[] | null, color: number[] | null) {
    if (index !== null) {
      this.index = index;
    }
    if (pos !== null) {
      this.position = pos;
    }
    if (color !== null) {
      this.color = color;
    }
  }

  public rotate(): Shape {
    let index = this.index;
    index++;
    if (index === 4) {
      index = 0;
    }
    return new Shape(index, this.position, this.color);
  }

  public moveLeft(): Shape {
    let x = this.position[0];
    let y = this.position[1];
    y = y - 1;
    return new Shape(this.index, [x, y], this.color);
  }

  public moveRight(): Shape {
    let x = this.position[0];
    let y = this.position[1];
    y = y + 1;
    return new Shape(this.index, [x, y], this.color);
  }

  public moveDown(): Shape {
    let x = this.position[0];
    let y = this.position[1];
    x = x + 1;
    return new Shape(this.index, [x, y], this.color);
  }

  public getShape(): number[][] {
    const shape = this.shapes[this.index];
    shape[1][1] = this.color[0];
    switch (this.index) {
      case 0: shape[1][0] = this.color[1]; break;
      case 1: shape[0][1] = this.color[1]; break;
      case 2: shape[1][2] = this.color[1]; break;
      case 3: shape[2][1] = this.color[1]; break;
    }
    return shape;
  }

  // |----y
  // |
  // |x
  public isCollisionWith(matrix: number[][]): boolean {
    const row = matrix[0];
    const rows = matrix.length;
    const cols = row.length;
    const shape: number[][] = this.shapes[this.index];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (shape[i][j] === 1) {
          const x: number = this.position[0] + i; // 0 <= x < 20
          const y: number = this.position[1] + j; // 0 <= y < 10
          if (x < 0 || x >= rows || y < 0 || y >= cols) { // point out of matrix
            return true;
          }
          if (matrix[x][y] > 0) { // point has already filled
            return true;
          }
        }
      }
    }
    return false;
  }

  public isBottom(matrix: number[][]): boolean {
    const x = this.position[0];
    const y = this.position[1];
    let points = [[x, y], [x, y]];
    switch (this.index) {
      case 0: points = [[x + 1, y], [x + 1, y + 1]]; break;
      case 1: points = [[x, y + 1], [x + 1, y + 1]]; break;
      case 2: points = [[x + 1, y + 2], [x + 1, y + 1]]; break;
      case 3: points = [[x + 2, y + 1], [x + 1, y + 1]]; break;
    }

    for (let i = 0; i < points.length; i++) {
      const row = points[i][0];
      const col = points[i][1];
      if (row + 1 >= matrix.length) {
        return true;
      }
      if (row + 1 < matrix.length && matrix[row + 1][col] > 0) {
        if ((this.index === 1 && i !== 0) || (this.index === 3 && i !== 1) || this.index === 0 || this.index === 2) {
          return true;
        }
      }
    }
    return false;
  }
}
