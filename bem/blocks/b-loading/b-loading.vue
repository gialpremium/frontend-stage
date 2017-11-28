<template>
    <div class="b-loading"
        :class="[{
            'b-loading_type_wrapped' : wrapped,
            'b-loading_display_none' : hidden,
        }, `b-loading_bg_${bgColor}`, addClass ]"
    >
        <div class="b-loading__circle-wrapper" :class="`b-loading__circle-wrapper_size_${size}`">
            <div class="b-loading__circle b-loading__circle_delayed"></div>

            <div class="b-loading__circle"></div>

            <div v-if="text" class="b-loading__text">{{ text }}</div>
        </div>
    </div>
</template>

<script>
    export default { props : {
        size : {
            type    : String,
            default : 'small',
        },
        hidden : {
            type    : Number,
            default : 0,
        },
        text    : String,
        wrapped : {
            type    : Number,
            default : 0,
        },
        bgColor : {
            type    : String,
            default : 'invert',
        },
        addClass : {
            type    : String,
            default : '',
        },
        align : {
            type    : String,
            default : 'center',
        },
    } };
</script>

<style lang="less">
    @import "~b-loading/b-loading.less";
</style>
