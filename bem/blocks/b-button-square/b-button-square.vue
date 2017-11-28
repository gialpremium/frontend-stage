<template>
    <span class="b-button-square"
        :class="`b-button-square_icon_${icon} b-button-square_color_${color}
            b-button-square_size_${size} ${addClass}`"
        @click="onClick($event)"
    ></span>
</template>

<script>
    export default {
        props : {
            addClass : String,
            icon     : {
                type    : String,
                default : 'cart',
            },
            size : {
                type    : String,
                default : 'normal',
            },
            color : {
                type    : String,
                default : 'primary',
            },
        },
        methods : { onClick( event ) {
            this.$emit( 'click', event );
        } },
    };
</script>

<style lang="less">
    @import "~b-button-square/b-button-square.less";
</style>
