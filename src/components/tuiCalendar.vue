<template>
  <div class="wrap">
    <div class="tools">
      <button @click="prev">prev</button>
      <button @click="changeToDay">changeToDay</button>
      <button @click="changeToMonth">changeToMonth</button>
      <button @click="getSchedule">getSchedule</button>
      <button @click="after">after</button>
    </div>
    <vue-tuicalendar
      ref="calendar"
      :options="options"
      :schedules="schedules"
      @before-create-schedule="beforeCreateSchedule"
      @before-update-schedule="beforeUpdateSchedule"
      @before-render-schedule="beforeRenderSchedule"
      @after-render-schedule="afterRenderSchedule"
      @click-schedule="clickSchedule"
    >
    </vue-tuicalendar>
  </div>
</template>
<script lang='ts'>
import { VueTuicalendar } from '@lkmadushan/vue-tuicalendar';
import 'tui-calendar/dist/tui-calendar.min.css';
import Vue from 'vue';
export default Vue.extend({
  name: 'tui-calendar',
  components: {VueTuicalendar},
  data() {
    return {
      options: {
        useCreationPopup: true,
        useDetailPopup: true,
      },
      schedules: [
        {
          id: '1',
          calendarId: '1',
          title: 'A schedule',
          category: 'time',
          dueDateClass: '',
          start: '2019-01-22T22:30:00+09:00',
          end: '2019-01-23T02:30:00+09:00',
          bgColor: 'rgba(123, 123, 123, 255)'
        },
        {
          id: '2',
          calendarId: '2',
          title: 'Another schedule',
          category: 'time',
          dueDateClass: '',
          start: '2019-01-26T17:30:00+09:00',
          end: '2019-01-28T17:31:00+09:00'
        }
      ]
    };
  },
  methods: {
    beforeCreateSchedule(event) {
      const calendar: any = this.$refs.calendar;
      console.log('beforeCreateSchedule', event);
      calendar.fireMethod('createSchedules', [
        {
          id: '3',
          calendarId: '3',
          title: event.title,
          category: 'task',
          dueDateClass: '',
          start: event.start,
          end: event.end
        }
      ]);
    },
    beforeUpdateSchedule(event) {
      const calendar: any = this.$refs.calendar;
      const schedule = event.schedule;
      const startTime = event.start;
      const endTime = event.end;
      console.log(schedule, startTime, endTime);
      calendar.fireMethod('updateSchedule', schedule.id, schedule.calendarId, {
        start: startTime,
          end: endTime
      });
    },
    afterRenderSchedule(event) {
      console.log('afterRenderSchedule', event);
    },
    beforeRenderSchedule(event) {
      console.log('beforeRenderSchedule', event);
    },
    clickSchedule(event) {
      console.log('clickSchedule', event);
    },
    prev() {
      const calendar: any = this.$refs.calendar;
      calendar.fireMethod('prev');
    },
    after() {
      const calendar: any = this.$refs.calendar;
      calendar.fireMethod('next');
    },
    getSchedule() {
      const calendar: any = this.$refs.calendar;
      const o = calendar.fireMethod('getSchedule', '3', '3');
      console.log(o);
    },
    changeToDay() {
      const calendar: any = this.$refs.calendar;
      calendar.fireMethod('changeView', 'day', true);
    },
    changeToMonth() {
      const calendar: any = this.$refs.calendar;
      calendar.fireMethod('changeView', 'month', true);
    }
  }
});
</script>
<style lang='less' scoped>
  .wrap {
    width: 1000px;
    height: 800px;
    .tools {
      display: flex;
    }
  }
</style>