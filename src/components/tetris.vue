<template>
  <div class="te_wrap">
    <div class="te_box_wrap">
      <div class="row" v-for="(row, rowIndex) in showMatrix" :key="rowIndex">
        <div :class="cellClassCalculate(cell, rowIndex, cellIndex)" v-for="(cell, cellIndex) in row" :key="cellIndex"></div>
      </div>
    </div>
    <div class="te_box_func">
      <div class="te_box_func__list">
        <div class="key" v-for="(key, index) in keys">{{key}}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Shape from '@/ts/tetris/Shape';
import { fromJS, List } from 'immutable';
import { fromEvent, interval, merge, Observable } from 'rxjs';
import {filter, map, throttleTime} from 'rxjs/operators';
import Vue from 'vue';
import {mapGetters} from 'vuex';
const rows = 20;
const cols = 10;
export default Vue.extend({
  name: 'tetris',
  data() {
    return {
      keydown$: {} as Observable<Event>,
      keys: ['', '', '', '', '', '', '', '', '', ''] as string[]
    };
  },
  computed: {
    ...mapGetters({
      matrix: 'tetris/getMatrix',
      shape: 'tetris/getShape'
    }),
    showMatrix() {
      const self: any = this;
      let matrix: List<List<number>> = fromJS(self.matrix);
      const shape: List<List<number>> = fromJS(self.shape.getShape());
      const pos: number[] = self.shape.position;
      shape.map((row, rowIndex) => {
        let matrixRow = matrix.get(rowIndex + pos[0]);
        if (matrixRow !== undefined && rowIndex + pos[0] < rows) {
          row.map((cell, cellIndex) => {
            if (matrixRow !== undefined && cellIndex + pos[1] < cols && cell > 0) {
              matrixRow = matrixRow.set(cellIndex + pos[1], cell);
            }
          });
          matrix = matrix.set(rowIndex + pos[0], matrixRow);
        }
      });
      return matrix.toJS();
    }
  },
  watch: {
    shape(shape) {
      if (shape.isBottom(this.showMatrix)) {
        this.$store.commit('tetris/updateMatrix', this.showMatrix);
        this.$store.commit('tetris/updateShape', new Shape(null, null, null));
      }
    }
  },
  mounted() {
    this.initObservable();
  },
  methods: {
    initObservable() {
      this.keydown$ = fromEvent(window.document, 'keydown');
      const keydown$keyValue: Observable<number> = this.keydown$.pipe(
        map((event: Event) => {
          if (event instanceof KeyboardEvent) {
            return event.keyCode;
          } else {
            return 0;
          }
        }),
        filter((keyCode: number) => {
          return keyCode >= 37 && keyCode <= 40;
        })
      );
      keydown$keyValue.subscribe(
        (next) => {
          this.eventHandler(next);
        }
      );
      const time$ = interval(1000).pipe(
        map((next) => {
          return 0;
        })
      );
      time$.subscribe(
        (next) => {
          this.eventHandler(40);
        }
      );
      const mergedStream$ = merge(keydown$keyValue.pipe(
        map((keyValue: number) => {
          let key = '';
          switch (keyValue) {
            case 37: key = '←'; break;
            case 38: key = '↑'; break;
            case 39: key = '→'; break;
            case 40: key = '↓'; break;
          }
          return key;
        })
      ), time$);
      mergedStream$.subscribe(
        (next: number | string) => {
          let keys: List<string> = fromJS(this.keys);
          keys = keys.pop().unshift(typeof next === 'number' ? '↓' : next);
          this.keys = keys.toJS();
        }
      );
    },
    cellClassCalculate(cell: number, rowIndex: number, cellIndex: number): string {
      const colors: string[] = ['', 'cell_red', 'cell_orange', 'cell_green', 'cell_blue', 'cell_purple', 'cell_pink'];
      return `cell ${colors[cell]}`;
    },
    eventHandler(keyCode: number) {
      const self: any = this;
      let shape = {} as Shape;
      switch (keyCode) {
        case 37: shape = self.shape.moveLeft(); break;
        case 38: shape = self.shape.rotate(); break;
        case 39: shape = self.shape.moveRight(); break;
        case 40: shape = self.shape.moveDown(); break;
      }
      if (!shape.isCollisionWith(self.matrix)) {
          this.$store.commit('tetris/updateShape', shape);
      }
    },
    randomMatrix(): number[][] {
      const self: any = this;
      let matrix: List<List<number>> = fromJS(self.matrix);
      for (let i = 0; i < rows; i++) {
        let row: List<number> | undefined = matrix.get(i);
        if (row) {
          for (let j = 0; j < cols; j++) {
            row = row.set(j, Math.random() > 0.5 ? 1 : 0);
          }
          matrix = matrix.set(i, row);
        }
      }
      return matrix.toJS();
    }
  }
});
</script>
<style lang="less" scoped>
@width: 400px;
@height: 400px;
.te_wrap {
  width: @width;
  height: @height;
  display: flex;
  flex-direction: row;
  .te_box_wrap {
    width: @width * 0.5;
    height: @height;
    .row {
      display: flex;
      flex-direction: row;
      .cell {
        height: @height * 0.05;
        width: @width * 0.05;
        background: lightgray;
      }
      .cell_red {
        background: lightcoral;
      }
      .cell_orange {
        background: lightsalmon;
      }
      .cell_green {
        background: lightgreen;
      }
      .cell_blue {
        background: lightblue;
      }
      .cell_purple {
        background: purple;
      }
      .cell_pink {
        background: pink;
      }
    }
  }
  .te_box_func {
    width: @width * 0.2;
    height: @height;
    background: lightcyan;
    .key {
      height: @height * 0.1;
      line-height: @height * 0.1;
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
