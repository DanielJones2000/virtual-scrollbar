<template>
    <div class="common-scrollBar">
        <div class="common-scrollBar-vertical">
            <!-- 滚动内容 -->
            <div ref="container"
                 class="common-scrollBar-container">
                <slot></slot>
            </div>
            <!-- 纵向滚动条 -->
            <div ref="verticalScrollBar"
                 v-show="showVertical"
                 class="common-scrollBar-vertical-track">
                <div class="common-scrollBar-vertical-thumb"
                     :style="verticalSliderStyle"
                     @pointerdown="pointerdown('vertical', $event)">
                </div>
            </div>
        </div>
        <!-- 水平滚动条 -->
        <div class="common-scrollBar-horizontal">
            <div ref="horizontalScrollBar"
                 class="common-scrollBar-horizontal-track">
                <div class="common-scrollBar-horizontal-thumb"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        verticalSliderStyle () {
            //纵向滚动条
            return {
                height: `${this.verticalSliderSize}px`,
                top: `${this.verticalSliderY}px`
            }
        }
    },
    props: {
        overflowX: {
            type: Boolean,
            default: true
        },
        overflowY: {
            type: Boolean,
            default: false
        },
    },
    data () {
        return {
            //滚动内容包含隐藏部分的高
            scrollHeight: 0,
            //滚动内容包含隐藏部分的宽
            scrollWidth: 0,
            // 滚动内容不包含隐藏部分的高
            viewportWidth: 0,
            // 滚动内容不包含隐藏部分的宽
            viewportHeight: 0,
            // 滑块最小的尺寸
            minSliderSize: 30,
            // 垂直方向滚动条的高度
            verticalScrollBarHeight: 0,
            // 垂直方向滑块大小（按比例显示）
            verticalSliderSize: 0,
            // 垂直方向滑块移动的位置
            verticalSliderY: 0,
            // 垂直方向滚动条内容大小的比例
            verticalRatio: 1,
            // 是否显示垂直滚动条
            showVertical: true,
            // 是否显示水平滚动条
            showHorizontalTrack: false,
            // 是否激活鼠标移动和抬起标识
            activeBlock: false,
            // 鼠标点信息
            point: {
                // 按下时点的坐标
                start: { x: 0, y: 0 },
                // 当前点的坐标
                current: { x: 0, y: 0 }
            },
            observer: null,
            type: null
        }
    },
    created () {
        document.addEventListener('pointerup', this.pointerup, true)
        document.addEventListener('pointermove', this.pointermove, true)
        window.onmousewheel = document.onmousewheel = event => {
            this.mousewheel(event)
        }
    },
    mounted () {
        this.observer = new MutationObserver(() => {
            this.resetSize()
        })
        this.$nextTick(() => {
            this.observer.observe(this.$refs.container, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            })
            this.resetSize()
        })
    },
    methods: {
        computeVertical () {
            // 计算垂直滚动条的数据
            const verticalRatio = this.verticalScrollBarHeight / this.scrollHeight
            this.showVertical = true
            if (verticalRatio === 1) {
                this.showVertical = false
            }
            this.verticalSliderSize = this.verticalScrollBarHeight * verticalRatio
            if (this.verticalSliderSize < this.minSliderSize) {
                this.verticalSliderSize = this.minSliderSize
            }
            if (this.verticalSliderSize > this.verticalScrollBarHeight) {
                this.verticalSliderSize = this.verticalScrollBarHeight
                this.showVertical = false
            }
            if (this.verticalSliderY > 0 && (this.verticalSliderY + this.verticalSliderSize) >= this.verticalScrollBarHeight) {
                this.verticalSliderY = this.verticalScrollBarHeight - this.verticalSliderSize
            }
            if (this.verticalSliderY <= 0) {
                this.verticalSliderY = 0
            }
            this.verticalRatio = (this.verticalScrollBarHeight - this.verticalSliderSize) / (this.scrollHeight - this.viewportHeight)
        },
        resetSize () {
            const { clientWidth, clientHeight, scrollHeight, scrollWidth } = this.$refs.container
            this.scrollHeight = scrollHeight
            this.scrollWidth = scrollWidth
            this.viewportWidth = clientWidth
            this.viewportHeight = clientHeight
            if (this.$refs.verticalScrollBar) {
                this.verticalScrollBarHeight = this.$refs.verticalScrollBar.clientHeight
            }
            if (this.overflowX) {
                this.computeVertical()
            }
        },
        pointerdown (type, e) {
            this.type = type
            this.activeBlock = true
            const { clientX, clientY } = e
            this.point.start = {
                x: clientX,
                y: clientY
            }
            this.point.current.y = this.verticalSliderY
        },
        pointerup (e) {
            if (!this.activeBlock) return
            this.activeBlock = false
        },
        pointermove (e) {
            if (!this.activeBlock) return
            const { clientX, clientY } = e
            if (this.type === 'vertical') {
                const diffY = clientY - this.point.start.y
                this.verticalSliderY = diffY + this.point.current.y
                this.verticalMove()
            }
        },
        verticalMove () {
            if (this.verticalSliderY <= 0) {
                this.verticalSliderY = 0
            }
            if (this.verticalSliderY + this.verticalSliderSize > this.verticalScrollBarHeight) {
                this.verticalSliderY = this.verticalScrollBarHeight - this.verticalSliderSize
            }
            this.$refs.container.scrollTop = this.verticalSliderY / this.verticalRatio
        },
        mousewheel (event) {
            const delta = event.wheelDelta
            if (delta > 0) {
                this.verticalSliderY--
            } else if (delta < 0) {
                this.verticalSliderY++
            }
            this.verticalMove()
        }
    },
    beforeDestroy () {
        document.removeEventListener('pointerup', this.pointerup)
        document.removeEventListener('pointermove', this.pointermove)
        if (this.observer) this.observer.disconnect()
    }
}
</script>
<style lang="less">
.common-scrollBar {
    touch-action: none;
    width: 100%;
    height: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    // 内容
    &-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    // 纵向滚动条
    &-vertical {
        width: 100%;
        height: calc(100% - 15px);
        display: flex;
        justify-items: center;
        align-items: center;
        &-track {
            height: 100%;
            width: 15px;
            background: red;
            position: relative;
        }
        &-thumb {
            width: 100%;
            height: 50px;
            background: #000;
            position: absolute;
            cursor: pointer;
        }
    }
    &-horizontal {
        width: 100%;
        height: 15px;
        background: red;
        &-track {
            width: calc(100% - 15px);
            height: 100%;
            position: relative;
        }
        &-thumb {
            width: 50px;
            height: 100%;
            background: #000;
            position: absolute;
            cursor: pointer;
        }
    }
}
</style>
