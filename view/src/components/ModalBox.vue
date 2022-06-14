<template>
    <div class="ModalBox" data-id="sdjkfhskjgsdjk" ref="ModalBox" @click="boxClick">
        <div class="header" @mousedown.prevent.stop="(e) => mousedown(e, ModalBox)">
            <div class="header-left">
                <img v-if="config.icon" :src="config.icon" />
                <span>{{ config.title }}</span>
            </div>
            <div class="header-right">
                <!-- <span class="iconfont icon-zuixiaohua"></span> -->

                <img src="/static/images/min.png" />
                <img
                    v-if="isMax"
                    src="/static/images/ress.png"
                    @mousedown.prevent.stop
                    @click="switchSizeClick"
                />
                <img
                    v-else
                    src="/static/images/max.png"
                    @mousedown.prevent.stop
                    @click="switchSizeClick"
                />
                <img src="/static/images/close.png" @click.stop="close" />
            </div>
        </div>
        <div class="ModalBox-main">
            <slot name="main"></slot>
        </div>

        <span class="iconfont icon-shurukuanglashen" @mousedown.stop="StretchMousedown"></span>
    </div>
</template>



<script setup lang='ts'>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import mousedown from "@/plugin/el-drag";
interface Props {
    config: any
}
const props = withDefaults(defineProps<Props>(), {
    config() {
        return {}
    }
})
/* 事件订阅 */
const emit = defineEmits(['close', 'resize'])

const ModalBox: any = ref(null);
const isMax = ref<boolean>(false);
let size = {
    left: 0,
    top: 0,
    width: 0,
    height: "",
};
watch(isMax, (to) => {
    ModalBox.value.style.zIndex = Math.round(
        (new Date() as any) / 1000
    ).toString();
    if (to) {
        size = {
            left: ModalBox.value.offsetLeft,
            top: ModalBox.value.offsetTop,
            width: ModalBox.value.offsetWidth,
            height: ModalBox.value.offsetHeight,
        };
        ModalBox.value.style.transition = "0.3s";
        ModalBox.value.style.width = document.body.offsetWidth + "px";
        ModalBox.value.style.height = document.body.offsetHeight + "px";
        ModalBox.value.style.left = "0px";
        ModalBox.value.style.top = "0px";
    } else {
        ModalBox.value.style.transition = "0.3s";
        ModalBox.value.style.width = size.width + "px";
        ModalBox.value.style.height = size.height + "px";
        ModalBox.value.style.left = size.left + "px";
        ModalBox.value.style.top = size.top + "px";
    }
});

onMounted(() => {
    ModalBox.value.style.width = props.config.width + "px";
    ModalBox.value.style.height = props.config.height + "px";
    ModalBox.value.style.zIndex = Math.round(
        (new Date() as any) / 1000
    ).toString();
    window.addEventListener("resize", resize);
});

function resize() {
    if (isMax.value) {
        ModalBox.value.style.transition = "0.3s";
        ModalBox.value.style.width = document.body.offsetWidth + "px";
        ModalBox.value.style.height = document.body.offsetHeight + "px";
        ModalBox.value.style.left = "0px";
        ModalBox.value.style.top = "0px";
    }
}

onBeforeUnmount(() => {
    window.removeEventListener("resize", resize);
});

function StretchMousedown(event: MouseEvent): void {
    event.stopPropagation();
    const el: HTMLElement = ModalBox.value;
    const { left, top }: DOMRect = el.getBoundingClientRect();
    function mousemove(event: MouseEvent) {
        event.stopPropagation();
        let width = event.pageX - (left - 4);
        let height = event.pageY - (top - 4);
        el.style.transition = "none";
        el.style.width = (width < 460 ? el.offsetWidth : width) + "px";
        el.style.height = (height < 360 ? el.offsetHeight : height) + "px";
        emit("resize");
    }
    function mouseup() {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    }
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}

function switchSizeClick() {
    isMax.value = !isMax.value;
    let Time = setTimeout(() => {
        clearTimeout(Time);
        emit("resize");
    }, 200);
}

function boxClick() {
    ModalBox.value.style.zIndex = Math.round(
        (new Date() as any) / 1000
    ).toString();
}

function close() {
    ModalBox.value.style.transition = "0.3s";
    ModalBox.value.style.transform = "scale(0.8)";
    ModalBox.value.style.opacity = "0";
    let Time = setTimeout(() => {
        clearTimeout(Time);
        emit("close");
    }, 200);
}


</script>



<style lang="scss" scoped>
@import "../assets/css/mixin.scss";
@keyframes open {
    from {
        opacity: 0;
        transform: scale(0.4);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
.ModalBox {
    width: 800px;
    height: 600px;
    border-radius: 5px;
    overflow: hidden;
    animation: open 0.2s linear;
    position: fixed;
    left: 20%;
    top: 100px;
    padding-top: 40px;
    box-sizing: border-box;
    z-index: 399;
    background-color: transparent !important;
    box-shadow: 1px 1px 10px 2px rgba($color: #888, $alpha: 0.3);
    > .header {
        width: 100%;
        height: 40px;
        background-color: #fff;
        padding: 0 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: absolute;
        left: 0;
        top: 0;
        user-select: none;
        cursor: move;
        > .header-left {
            flex: 1;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            overflow: hidden;
            > img {
                width: 20px;
                height: 20px;
            }
            > span {
                width: 100%;
                font-size: 14px;
                color: #888;
                margin-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        > .header-right {
            width: 120px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            > img {
                width: 26px;
                height: 26px;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-left: 10px;
                box-sizing: border-box;
                color: #333;
                border-radius: 1px;
                &:hover {
                    background-color: #f5f5f5;
                }
            }
            > img:nth-child(1) {
                opacity: 0.3;
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }
    > .ModalBox-main {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
    }
    > .icon-shurukuanglashen {
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 999;
        color: #00bebe;
        font-size: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        cursor: se-resize;
    }
}
</style>