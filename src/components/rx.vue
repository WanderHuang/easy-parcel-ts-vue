<template>
  <div class="tetris-wrap">
    <div>{{text}}</div>
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="tetris-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" :class="col === 1 ? 'tetris-cell' : ''"></div>
    </div>
  </div>
</template>
<script lang="ts">
import RX, { fromEvent, interval, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, every, map, scan, startWith } from 'rxjs/operators';
import Vue from 'vue';
export default Vue.extend({
  name: 'rx-vue-learn',
  data() {
    return {
      text: 0
    };
  },
  subscriptions() {
    const self: any = this;
    return {
      rows: self.initMatrixOb(),
      keyCode: self.initKeyCodeOb()
    };
  },
  methods: {
    initMatrixOb() {
      return interval(1000).pipe(
        map((next) => {
          const self$: any = this;
          return self$.generateMatrix();
        })
      );
    },
    initKeyCodeOb() {
      const key$ = fromEvent(window, 'keydown').pipe(
        map((next) => {
          const e: any = next;
          console.log(e.keyCode);
          return e.keyCode;
        }),
        startWith('keys here')
      );
      key$.subscribe(
        (next) => {
          this.text = parseFloat(Math.random().toFixed(16));
        }
      );
      return key$;
    },
    generateMatrix() {
      const matrix = [] as number[][];
      for (let i = 0; i < 10; i++) {
        const row = [] as number[];
        for (let j = 0; j < 10; j++) {
          row.push(Math.random() > 0.8 ? 1 : 0);
        }
        matrix.push(row);
      }
      return matrix;
    }
  }
});
</script>
<style lang="less" scoped>
.tetris-wrap {
  .tetris-row {
    display: flex;
    flex-direction: row;
    width: 100px;
    height: 10px;
    background: lavender;
    .tetris-cell {
      width: 10px;
      height: 10px;
      background: gray;
    }
  }
}
</style>

