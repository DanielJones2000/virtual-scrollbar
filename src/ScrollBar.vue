<template>
    <div class="common-scrollBar">
        <div ref="content" 
             class="common-scrollBar-content">
            <slot></slot>
        </div>
        <div class="common-scrollBar-track" 
             :style="{display:showTrack}">
            <div class="common-scrollBar-thumb" 
                 :style="thumbVerticalStyle"
                 @pointerdown="pointerdown">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        thumbVerticalStyle() {
            return {
                height:`${this.thumbHeight}px`,
                top:`${this.thumbY}px`
            }
        },
        showTrack() {
            return this.showBar ? 'block' : 'none'
        }
    },
    data() {
        return {
            showBar: false,
            scrollHeight: 0,
            scrollWidth: 0,
            clientWidth: 0,
            clientHeight: 0,
            minThumbHeight: 30,
            isDown: false,
            point: {
                start:{x:0, y:0},
                current:{x:0, y:0}
            },
            thumbY: 0,
            percentage: 1,
            thumbHeight: 0
        }
    },
    created() {
        document.addEventListener('pointerup', this.pointerup, true)
        document.addEventListener('pointermove', this.pointermove, true)
    },
    mounted() {
        this.$nextTick(() => {
            const { scrollHeight, scrollWidth, clientWidth, clientHeight } = this.$refs.content
            this.scrollHeight = scrollHeight
            this.scrollWidth = scrollWidth
            this.clientWidth = clientWidth
            this.clientHeight = clientHeight
            const percentage = this.clientHeight / this.scrollHeight
            this.showBar = true
            if(percentage === 1) {
                this.showBar = false
            }
            this.thumbHeight = Math.round(this.clientHeight * percentage)
            if(this.thumbHeight < this.minThumbHeight) {
                this.thumbHeight = this.minThumbHeight
            }
            this.percentage = (this.clientHeight - this.thumbHeight) / this.scrollHeight
        })
    },
    methods: {
        pointerdown(e) {
            this.isDown = true
            const {clientX,clientY} = e
            this.point.start = {
                x: clientX,
                y: clientY
            }
            this.point.current.x = this.thumbY
        },
        pointerup(e) {
            if(!this.isDown) return
            this.isDown = false
        },
        pointermove(e) {
            if(!this.isDown) return
            const {clientX, clientY} = e
            const diffY = clientY - this.point.start.y
            this.thumbY = diffY + this.point.current.x
            if(this.thumbY <= 0) {
                this.thumbY = 0
            }
            if(this.thumbY + this.thumbHeight > this.clientHeight) {
                this.thumbY = this.clientHeight - this.thumbHeight
            }
            this.$refs.content.scrollTop = this.thumbY / this.percentage
        }
    },
    beforeDestroy() {
        document.removeEventListener('pointerup', this.pointerup)
        document.removeEventListener('pointermove', this.pointermove)
    }
}
</script>
<style>
.common-scrollBar {
    display: flex;
    justify-items: center;
    align-items: center;
    touch-action: none;
}

.common-scrollBar-content {
    width: 100%;
    height:100%;
    overflow: hidden;
}

.common-scrollBar-track {
    height: 100%;
    width: 30px;
    background: red;
    position: relative;
}

.common-scrollBar-thumb {
    width: 50px;
    height: 50px;
    background: black;
    position: absolute;
    margin-left: -10px;
    cursor: pointer;
}
</style>