<template>
  <div class="c_wrap">
    <div class="c_header">
      <div class="c_header_details">
        <div>
          {{showDate}}
        </div>
      </div>
      <div class="c_header_options">
        <button @click="updateDays('prev')"><</button>
        <button @click="lang= lang === 'en'? 'zh' : 'en'" class="center">{{lang === 'en' ? '中文': 'English'}}</button>
        <button @click="updateDays('after')">></button>
      </div>
    </div>
    <div class="c_week_row">
      <div class="c_week_cell" v-for="(week, index) in weeks" :key="index">
        <div class="c_week_inner" :style="{'background':index === 0 || index === 6 ? 'orange': 'lightblue'}">
          {{week}}
        </div>
      </div>
    </div>
    <div class="calendar-css-wrap" v-stream:mousemove="mousemove$" v-stream:mouseout="mouseout$" v-stream:click="click$">
      <div class="c_day_row" v-for="(row, rowIndex) in matrix" :key="rowIndex">
        <div :class="cellClassObject(currentPos, rowIndex, cellIndex)" v-for="(cell, cellIndex) in row" :key="cellIndex" :style="cellStyle(cell, rowIndex, cellIndex)">
          <div class="c_day_inner" :style="cellInnerStyle(showDays[rowIndex][cellIndex], rowIndex, cellIndex)">
            <span>{{showDays && showDays[rowIndex][cellIndex]}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {fromJS, List} from 'immutable';
import {Observable, Observer, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Vue from 'vue';
import {CalendarUtil} from '../ts/CalendarUtil';
const baseWidth = 50;
const dayRows = 5;
const dayCols = 7;
export default Vue.extend({
  name: 'calendar',
  data() {
    return {
      weeks: [],
      days: [] as number[][],
      currentPos: [] as number[],
      today: [] as number[],
      currentDate: {} as Date, // someday of current month
      page: 0,
      prevMonthMax: 0,
      lang: 'en'
    };
  },
  subscriptions() {
    const self: any = this;
    self.mousemove$ = new Subject();
    self.mouseout$ = new Subject();
    self.click$ = new Subject();
    self.click$.pipe(
      map((mousemove: any) => {
        const event: MouseEvent = mousemove.event;
        const target: any = event.target!;
        return [event.offsetX, event.offsetY];
      })
    ).subscribe(
      (next) => {
        const x = Math.floor(next[1] / baseWidth);
        const y = Math.floor(next[0] / baseWidth);
        self.updateCurrentPos(x, y);
        if (self.days[x][y] === 0) {
          self.updateDays(x > 0 ? 'after' : 'prev');
        }

      }
    )
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
  computed: {
    showDays(): number[][] {
      const out = fromJS(this.days).toJS();
      let after = 1;
      let max = this.prevMonthMax;
      if (max && this.days.length === 5) {
        for (let i = 0; i < 7; i++) {
          if (this.days[0][6 - i] === 0) {
            out[0][6 - i] = max--;
          }
          if (this.days[4][i] === 0) {
            out[4][i] = after++;
          }
        }
      }
      return out;
    },
    showDate(): string {
      return `${this.currentDate.getFullYear()} ${this.lang === 'en' ? '.' : '年'} ${this.currentDate.getMonth() + 1} ${this.lang === 'en' ? '.' : '月'}`;
    }
  },
  watch: {
    days(val) {
      if (val) {
        const currentDate: any = this.currentDate;
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        const out: any = this.getPrevMonth(year, month);
        year = out.year;
        month = out.month;
        this.prevMonthMax = CalendarUtil.getMonthMaxDay(year, month);
      }
    },
    lang(val) {
      this.weeks = CalendarUtil.weeks[this.lang];
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.weeks = CalendarUtil.getWeeks(this.lang);
      this.days = CalendarUtil.getDays(null);
      this.currentDate = new Date();
      this.currentPos = this.getPosition(this.currentDate);
      this.page = 0;
      this.today = [...this.currentPos];
    },
    getPosition(date: Date): number[] {
      const position = [0, 0];
      const day = date.getDate();
      for (let i = 0; i < dayRows; i++) {
        for (let j = 0; j < dayCols; j++) {
          if (this.days[i][j] === day) {
            position[0] = i;
            position[1] = j;
          }
        }
      }
      return position;
    },
    generateMatrix(): List<List<number>> {
      let matrix: List<List<number>> = List([]);
      for (let i = 0; i < dayRows; i++) {
        let row: List<number> = List([]);
        for (let j = 0; j < dayCols; j++) {
          row = row.set(j, 0);
        }
        matrix = matrix.set(i, row);
      }
      return matrix;
    },
    updateDays(flag) {
      const currentDate: any = this.currentDate;
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth();
      if (flag === 'prev') {
        const out: any = this.getPrevMonth(year, month);
        year = out.year;
        month = out.month;
        this.page--;
      } else {
        const out: any = this.getAfterMonth(year, month);
        year = out.year;
        month = out.month;
        this.page++;
      }
      this.currentDate = new Date(`${year}-${month + 1}-${1}`);
      this.days = CalendarUtil.getDays(this.currentDate);
    },
    getPrevMonth(year: number, month: number): {} {
      month = month - 1;
      if (month < 0) {
        year = year - 1;
        month = 11;
      }
      return {
        year,
        month
      };
    },
    getAfterMonth(year: number, month: number): {} {
      month = month + 1;
      if (month > 11) {
        year = year + 1;
        month = 0;
      }
      return {
        year,
        month
      };
    },
    updateCurrentPos(rowIndex: number, cellIndex: number) {
      this.currentPos = [rowIndex, cellIndex];
    },
    cellClassObject(currentPos, rowIndex, cellIndex) {
      return currentPos[0] === rowIndex && currentPos[1] === cellIndex ? 'c_day_cell current_cell' : 'c_day_cell';
    },
    cellStyle(type: number, y: number, x: number) {
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
      const theme: any = CalendarUtil.getTheme(0);
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
    cellInnerStyle(cell, rowIndex, cellIndex) {
      return {
        background: this.page === 0 && this.today[0] === rowIndex && this.today[1] === cellIndex ? '#656565' : '',
        color: (cell > 7 && rowIndex === 0) || (cell < 8 && rowIndex === 4) ? 'gray' : ''
      }
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
        if (y < dayCols - 1) {
          current = current.set(y + 1, 6);
        }
        list = list.set(x, current);
      }
      if (prev && x - 1 >= 0) {
        prev = prev.set(y, 2);
        if (y - 1 >= 0) {
          prev = prev.set(y - 1, 1);
        }
        if (y + 1 <= dayCols - 1) {
          prev = prev.set(y + 1, 3);
        }
        list = list.set(x - 1, prev);
      }
      if (after) {
        after = after.set(y, 8);
        if (y - 1 >= 0) {
          after = after.set(y - 1, 7);
        }
        if (y + 1 <= dayCols - 1) {
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
@BASEWIDTH: 50px;
.c_wrap {
  width: @BASEWIDTH * 7;
  // height: @BASEWIDTH * 6;
  display: flex;
  flex-direction: column;
  .c_header {
    display: flex;
    justify-content: space-between;
    height: 24px;
    .c_header_options {
      button {
        width: 60px;
        height: 100%;
        background: lightblue;
        border-radius: 4px;
      }
      .center {
        width: 80px;
      }
    }
  }
  .c_week_row {
    height: @BASEWIDTH;
    width: 100%;
    display: flex;
    .c_week_cell {
      width: @BASEWIDTH;
      height: @BASEWIDTH;
      .c_week_inner{
        width: 100%;
        height: @BASEWIDTH;
        line-height: @BASEWIDTH;
        text-align: center;
      }
    }
  }
  .calendar-css-wrap{
    width: 100%;
    height: @BASEWIDTH * 5;
    background: #212121;
    .c_day_row {
      background: transparent;
      display: flex;
      flex-direction: row;
      width: @BASEWIDTH * 10;
      height: @BASEWIDTH;
      color:#fff;
      pointer-events: none;
      .c_day_cell {
        pointer-events: none;
        width: @BASEWIDTH;
        height: @BASEWIDTH;
        box-sizing: border-box;
        display: flex;      
        justify-content: center;
        align-items: center;
        .c_day_inner {
          width: @BASEWIDTH - 8;
          height: @BASEWIDTH - 8;
          background: #212121;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .current_cell {
        background: #656565 !important;
      }
    }
  }
}
</style>
