<template>
    <input class="b-input"
        :name="name"
        :class="getSubclasses(mods)"
        @input="$emit('input', $event.target.value)"
    >
</template>

<script>
export default {
    props : {
        name : String,
        mods : Object,
    },
    methods : {
        getSubclasses(args) {
            const mods = [];

            if ( !args ) {
                return;
            }

            for ( let mod in args ) {
                mods.push(`b-input_${mod}_${args[mod]}`)
            }

            return mods;
        }
    }
};
</script>

<style lang="less">
    @import "~b-input/b-input.less";
</style>
