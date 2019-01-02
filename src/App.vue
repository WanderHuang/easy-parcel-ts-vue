<template>
  <div id="app">
    <header class="header">Home page</header>
    <section>
      <router-link to="/route1">route1</router-link>
      <router-link to="/route2">route2</router-link>
      <router-link to="/rx">rx</router-link>
      <router-link to="/calendarCss">calendarCss</router-link>
      <router-link to="/worker">worker</router-link>
    </section>
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'app'
});
</script>
<style lang="less" scoped>
.header {
  background: gray
}
</style>

