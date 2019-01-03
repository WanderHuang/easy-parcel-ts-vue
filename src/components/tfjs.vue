<template>
  <div>{{out}}</div>
</template>
<script lang="ts">
import * as tf from '@tensorflow/tfjs';
import { Rank, Tensor } from '@tensorflow/tfjs';
import Vue from 'vue';
export default Vue.extend({
  name: 'tfjs',
  data() {
    return {
      out: ''
    };
  },
  mounted() {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
    model.fit(xs, ys).then(() => {
      const tfout: Tensor<Rank> | Tensor<Rank>[] = model.predict(tf.tensor2d([5], [1, 1]));
      if (tfout instanceof Tensor) {
        tfout.print();
        tfout.data().then((out) => {
          this.out = out.toString();
        });
      }
    });
  }
});
</script>
