<template>
    <div id="app">
        <button @click="del">删除</button>
        <button @click="add">添加</button>
        <ScrollBar style="width:calc(100% - 100px);height:500px;border:1px solid #000;user-select:none;">
            <div style="width:20000px">
                <span v-for="item in total"
                      :key="item">line:{{item}} -- 测试节点</span>
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
    data () {
        return {
            total: 1000
        }
    },
    methods: {
        del () {
            this.total--
            if (this.total <= 1) {
                this.total = 1
            }
        },
        add () {
            this.total++
        }
    }
}
</script>
