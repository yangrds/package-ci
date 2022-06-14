<template>
    <div class="modal-view">
        <div class="modal-header">
            <div class="modal-title">
                <span>{{ title }}</span>
            </div>
            <slot name="modal-operate"></slot>
        </div>
        <slot name="modal-body"></slot>
    </div>
</template>



<script setup lang='ts'>
interface Props {
    title: string
}
const props = withDefaults(defineProps<Props>(), {
    title: ''
})
</script>



<style lang="scss" scoped>
.modal-view {
    width: 100%;
    display: inline-block;
    border: 1px solid rgba($color: #888, $alpha: 0.2);
    box-sizing: border-box;
    padding-left: 20px;
    margin-top: 30px;
    padding-top: 20px;
    position: relative;
    &:deep(.modal-col) {
        width: 100%;
        margin-bottom: 20px;
    }

    .modal-header {
        display: flex;
        align-items: center;
        height: 34px;
        position: absolute;
        left: -1px;
        top: -36px;
        background-color: #fff;
        .modal-title {
            width: auto;
            height: 100%;
            display: flex;
            padding: 0 20px;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            > span {
                color: #888;
                font-weight: 900;
                font-size: 14px;
            }
        }
        > .modal-operate {
            width: auto;
            height: 100%;
            margin-left: 10px;
            display: flex;
            align-items: center;
            // background-color: #f5f5f5;
        }
    }
    &:deep(.modal-body) {
        width: 100%;
        .modal-child {
            width: 100%;
            display: flex;
            align-items: center;
            padding-left: 100px;
            padding-right: 30px;
            box-sizing: border-box;
            position: relative;
            > .label {
                width: 100px;
                height: 32px;
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                align-items: center;
                color: #333;
                font-size: 14px;
                font-weight: 900;
            }

            > .textarea {
                width: 100%;
                height: 200px;
                overflow: hidden;
                background-color: #f5f5f5;
                box-sizing: border-box;
                padding: 10px;
                padding-top: 8px;
                > textarea {
                    width: 100%;
                    height: 100%;
                    border: none;
                    box-sizing: border-box;
                    outline: none;
                    background-color: transparent;
                    font-size: 14px;
                    resize: none;
                    line-height: 22px;
                    color: #000;
                }
            }
            > .text {
                width: 100%;
                height: 32px;
                display: flex;
                > span {
                    width: 100%;
                    height: 32px;
                    line-height: 32px;
                    padding: 0 10px;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background-color: #f5f5f5;
                    color: #666;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>