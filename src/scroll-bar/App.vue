<template>
    <div id="app">
        <button @click="del">删除</button>
        <button @click="add">添加</button>
        <ScrollBar class="scroll-bar">
            <!-- <div style="width:2000px;"> -->
            <span v-for="item in total"
                  :key="item">line:{{item}} -- 测试节点<br /></span>
            <!-- </div> -->
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
            total: 100
        }
    },
    methods: {
        del() {
            this.total--
            if (this.total <= 1) {
                this.total = 1
            }
        },
        add() {
            this.total++
        }
    }
}
</script>
<style lang="less">
.scroll-bar {
    width: calc(100% - 100px);
    height: 500px;
    border: 1px solid #000;
    user-select: none;
}
</style>
