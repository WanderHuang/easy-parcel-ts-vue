<template>
  <div class="grid-wrap">
    <div class="vice1">
      <div style="width: 100%">
        1
      </div>
    </div>
    <div class="vice2">
      <div style="width: 100%">
        2
      </div>
    </div>
    <div class="main">
      <div style="width: 1000px">
        3
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'grid'
});
</script>
<style lang="less" scoped>
.grid-wrap {
  display: grid;
  width: 500px;
  height: 500px;
  background: lightcyan;
  grid-template-columns: 70% 30%;
  grid-template-rows: 50% 50%;
  grid-template-areas: 
  "vice1-block main-block"
  "vice2-block main-block";
  .main {
    grid-area: main-block;
    background: lightgreen;
  }
  .vice1 {
    grid-area: vice1-block;
    background: lightcoral;
    border: 1px solid blue;
  }
  .vice2 {
    grid-area: vice2-block;
    background: lightcoral;
    border: 1px solid blue;
  }
}
</style>

