<template>
  <div>
    <header>Route1</header>
    <section class="dark-bg">
      <div>{{status}}</div>
    </section>
    <footer>
      <button @click="commitStatus">CommitStatus</button>
      <button @click="dispatchStatus">DispatchStatus</button>
    </footer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {mapGetters} from 'vuex';
export default Vue.extend({
  name: 'route1',
  created() {
    console.log('route1');
  },
  computed: {
    ...mapGetters({
      status: 'module1/getStatus'
    })
  },
  watch: {
    status(newValue: number, oldValue: number) {
      console.log('route1', newValue, oldValue);
    }
  },
  methods: {
    commitStatus() {
      this.$store.commit('module1/updateStatus', this.status + 1);
    },
    dispatchStatus() {
      this.$store.dispatch('module1/updateStatus', this.status + 1);
    }
  }
});
</script>
<style lang="less" scoped>
.dark-bg {
  background: darkgray
}
</style>
