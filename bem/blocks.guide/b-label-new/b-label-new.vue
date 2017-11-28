<template>
    <span :class="blockClass">
        <span :class="[ contentClass, contentMods( {color, size} ) ]">
            {{ text }}
        </span>
    </span>
</template>

<script>
export default {
    props : [
        'color',
        'size',
        'text'
    ],
    data() {
        return {
            blockClass   : 'b-label-new',
            contentClass : 'b-label-new__content'
        }
    },
    methods: {
        contentMods: function( mods ) {
            var cssClasses = [];

            for (var key in mods) {
                if ( !mods[key] ) continue;

                cssClasses.push(
                    this.contentClass
                    + '_' + key
                    + '_' + mods[key]
                );
            }

            return cssClasses;
        }
    }
}

<style lang="less">
    @import "~/b-label-new/b-label-new.less";
</style>
