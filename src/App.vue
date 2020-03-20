<template>
  <div id="app">
    <ScrollBar style="width:calc(100% - 100px);height:500px;border:1px solid #000;">
      <div>
        <h2 v-for="item in 3812" :key="item">line:{{item}} -- asdasdasd<br/></h2>
      </div>
    </ScrollBar>
  </div>
</template>

<script>
import ScrollBar from './ScrollBar'

export default {
  components: {
    ScrollBar
  }
}
</script>