<template>
    <label
        class="b-button-switcher b-button-switcher_hover_on"
        :class="`${className} ${addClass}`"
        @click="onClick($event)"
    >
        <span v-if="isProcessing" class="b-button-switcher__processing"></span>

        <span v-if="isProcessing" class="b-button-switcher__processing b-button-switcher__processing_delayed"></span>

        <input v-if="isWithInput" class="b-button-switcher__hidden"
            type="checkbox"
            :name="inputName"
            :value="inputValue"
            :checked="inputChecked"
        >
    </label>
</template>

<script>
export default {
    props : {
        state : {
            required : true,
            type     : String,
        },
        isWithInput  : Boolean,
        inputName    : String,
        inputValue   : String,
        inputChecked : Boolean,
        isProcessing : Boolean,
        isDisabled   : Boolean,
        addClass     : {
            type    : String,
            default : '',
        },
    },
    computed : {
        className() {
            return this.isProcessing
                ? `b-button-switcher_state_${this.state} b-button-switcher_state_processing`
                : `b-button-switcher_state_${this.state}`;
        },
    },
    methods : {
        onClick( event ) {

            if ( this.isDisabled ) {
                return false;
            }

            this.$emit( 'click', event );
        },
    },
};
</script>

<style scoped lang="less">
    @import "~b-button-switcher/b-button-switcher.less";
</style>
