<template>
  <div>
    <header>Route2</header>
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
  name: 'route2',
  created() {
    console.log('route2');
  },
  computed: {
    ...mapGetters({
      status: 'module2/getStatus'
    })
  },
  watch: {
    status(newValue: number, oldValue: number) {
      console.log('route2', newValue, oldValue);
    }
  },
  methods: {
    commitStatus() {
      this.$store.commit('module2/updateStatus', this.status + 1);
    },
    dispatchStatus() {
      this.$store.dispatch('module2/updateStatus', this.status + 1);
    }
  }
});
</script>
<style lang="less" scoped>
.dark-bg {
  background: darksalmon
}
</style>
