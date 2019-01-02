<template>
  <div>
    <div>
      <input type="text" v-model="info" placeholder="message to be send to worker" v-stream:input="info$">
      <button @click="send">Send</button>
    </div>
    <div>
      <h6>Message to be send:</h6>
      <div>{{info}}</div>
    </div>
    <div>
      <h6>Get message from worker:</h6>
      <div>
        {{receive}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Vue from 'vue';
export default Vue.extend({
  name: 'worker',
  data() {
    return {
      worker: {},
      receive: ''
    };
  },
  subscriptions() {
    const self: any = this;
    self.info$ = new Subject();
    return {
      info: self.info$.pipe(
        map((e: any) => {
          const event: any = e.event;
          return event.target.value;
        })
      )
    };
  },
  mounted() {
    this.worker = new Worker('../worker/calculator.ts');
    const worker: any = this.worker;
    worker.onmessage = (message) => {
      this.receive = message.data;
    };
  },
  methods: {
    send() {
      const self: any = this;
      const worker: any = self.worker;
      worker.postMessage(self.info);
      this.receive = 'Waiting for receive messages from worker...';
    }
  }
});
</script>
