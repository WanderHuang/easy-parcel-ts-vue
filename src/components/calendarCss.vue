<template>
  <div class="calendar-css-wrap" v-stream:mousemove="mousemove$" v-stream:mouseout="mouseout$">
    <div v-for="(row, index) in matrix" :key="index" class="row">
      <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell" :style="currentStyle(cell, index, cellIndex)">
        <div class="inner"><span>{{cell === 5 ? 1 : 0}}</span></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {fromJS, List} from 'immutable';
import {Observable, Observer, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Vue from 'vue';
const baseWidth = 40;
const baseCount = 10;
const currentTheme = 0;
const themes = [
  {
    selected: '#808080',
    start: '#555555',
    end: '#2b2b2b'
  }
];
export default Vue.extend({
  name: 'calendar-css-demo',
  subscriptions() {
    const self: any = this;
    self.mousemove$ = new Subject();
    self.mouseout$ = new Subject();
    const mousemove$matrix = self.mousemove$.pipe(
      map((mousemove: any) => {
        const event: MouseEvent = mousemove.event;
        const target: any = event.target!;
        return [event.offsetX, event.offsetY];
      })
    );
    const matrix$ = Observable.create((observer: Observer<number[][]>) => {
      mousemove$matrix.subscribe(
        (next: number[]) => {
          const x = Math.floor(next[1] / baseWidth);
          const y = Math.floor(next[0] / baseWidth);
          observer.next(self.setCellStyle(x, y));
        }
      );
      self.mouseout$.subscribe(
        (next) => {
          observer.next(self.generateMatrix().toJS());
        }
      );
    });
    const position$ = Observable.create((observer: Observer<number[] | null>) => {
      mousemove$matrix.subscribe(
        (next: number[]) => {
          observer.next(next);
        }
      );
      self.mouseout$.subscribe(
        (next) => {
          observer.next(null);
        }
      );
    });
    return {
      matrix: matrix$.pipe(
        startWith(self.generateMatrix().toJS())
      ),
      position: position$
    };
  },
  methods: {
    generateMatrix(): List<List<number>> {
      let matrix: List<List<number>> = List([]);
      for (let i = 0; i < baseCount; i++) {
        let row: List<number> = List([]);
        for (let j = 0; j < baseCount; j++) {
          row = row.set(j, 0);
        }
        matrix = matrix.set(i, row);
      }
      return matrix;
    },
    currentStyle(type: number, y: number, x: number) {
      const self: any = this;
      const mouseX = self.position ? self.position[0] : 0;
      const mouseY = self.position ? self.position[1] : 0;
      const centerX = Math.floor(mouseX / baseWidth) * baseWidth + baseWidth * 0.5;
      const centerY = Math.floor(mouseY / baseWidth) * baseWidth + baseWidth * 0.5;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const maxRadius = baseWidth * 1.5;
      const minRadius = baseWidth * 0.5;
      const radius = baseWidth * 1.8;
      const theme = themes[currentTheme];
      let backgroundImage = '';
      switch (type) {
        case 1:
          backgroundImage = `radial-gradient(${radius}px at ${maxRadius + deltaX}px ${maxRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 2:
          backgroundImage = `radial-gradient(${radius}px at ${minRadius + deltaX}px ${maxRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 3:
          backgroundImage = `radial-gradient(${radius}px at ${-minRadius + deltaX}px ${maxRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 4:
          backgroundImage = `radial-gradient(${radius}px at ${maxRadius + deltaX}px ${minRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 5:
          break;
        case 6:
          backgroundImage = `radial-gradient(${radius}px at ${-minRadius + deltaX}px ${minRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 7:
          backgroundImage = `radial-gradient(${radius}px at ${maxRadius + deltaX}px ${-minRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 8:
          backgroundImage = `radial-gradient(${radius}px at ${minRadius + deltaX}px ${-minRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
        case 9:
          backgroundImage = `radial-gradient(${radius}px at ${-minRadius + deltaX}px ${-minRadius + deltaY}px, ${theme.start}, ${theme.end}, transparent)`;
          break;
      }
      return {
        'background-image': backgroundImage,
        'background': type === 5 ? theme.selected : 'transparent'
      };
    },
    setCellStyle(x: number, y: number): number[][] {
      let list: List<List<number>> = this.generateMatrix();
      let current: List<number> | undefined = list.get(x);
      let prev: List<number> | undefined = list.get(x - 1);
      let after: List<number> | undefined = list.get(x + 1);
      // 1 2 3
      // 4 5 6
      // 7 8 9
      if (current) {
        current = current.set(y, 5);
        if (y > 0) {
          current = current.set(y - 1, 4);
        }
        if (y < 9) {
          current = current.set(y + 1, 6);
        }
        list = list.set(x, current);
      }
      if (prev && x - 1 >= 0) {
        prev = prev.set(y, 2);
        if (y - 1 >= 0) {
          prev = prev.set(y - 1, 1);
        }
        if (y + 1 <= 9) {
          prev = prev.set(y + 1, 3);
        }
        list = list.set(x - 1, prev);
      }
      if (after) {
        after = after.set(y, 8);
        if (y - 1 >= 0) {
          after = after.set(y - 1, 7);
        }
        if (y + 1 <= 9) {
          after = after.set(y + 1, 9);
        }
        list = list.set(x + 1, after);
      }
      return list.toJS();
    }
  }
});
</script>
<style lang="less" scoped>
@BASEWIDTH: 40px;
.calendar-css-wrap{
  width: @BASEWIDTH * 10;
  height: @BASEWIDTH * 10;
  background: #000;
  .row {
    background: transparent;
    display: flex;
    flex-direction: row;
    width: @BASEWIDTH * 10;
    height: @BASEWIDTH;
    color:#fff;
    pointer-events: none;
    .cell {
      pointer-events: none;
      width: @BASEWIDTH;
      height: @BASEWIDTH;
      box-sizing: border-box;
      display: flex;      
      justify-content: center;
      align-items: center;
      .inner {
        width: @BASEWIDTH - 8;
        height: @BASEWIDTH - 8;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>

