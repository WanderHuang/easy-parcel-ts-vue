<template>
  <div class="app">
    <header class="header">Tech learn</header>
    <div class="content">
      <div class="router">
        <router-link to="/route1">route1</router-link>
        <router-link to="/route2">route2</router-link>
        <router-link to="/rx">rx</router-link>
        <router-link to="/calendarCss">calendarCss</router-link>
        <router-link to="/worker">worker</router-link>
        <router-link to="/tfjs">tfjs</router-link>
        <router-link to="/calendar">calendar</router-link>
      </div>
      <section class="view">
        <router-view></router-view>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'app'
});
</script>
<style lang="less" scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    background: gray;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    .router {
      width: 120px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: lightgray;
      a {
        display: block;
        height: 30px;
        line-height: 30px;
        text-decoration: none;
        border: 1px solid lightcoral;
      }
    }
  }
}
</style>

