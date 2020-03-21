<template>
  <div id="app">
    <button @click="del">删除</button>
    <ScrollBar style="width:calc(100% - 100px);height:500px;border:1px solid #000;user-select:none;">
      <div>
        <h2 v-for="item in total" :key="item">line:{{item}} -- 测试节点<br/></h2>
      </div>
    </ScrollBar>
  </div>
</template>

<script>
import ScrollBar from './ScrollBar'

export default {
  components: {
    ScrollBar
  },
  data() {
    return {
      total:50
    }
  },
  methods: {
    del() {
      this.total--
      if(this.total <= 1) {
        this.total = 1
      }
    }
  }
}
</script>