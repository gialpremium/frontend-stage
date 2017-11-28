<template>
    <span class="b-checkbox b-checkbox_marker_thin
        b-checkbox_font-size_normal
        b-checkbox_font-weight_normal
        b-checkbox_text-case_normal"
        :class="className"
    >
        <input class="b-checkbox__native"
            type="checkbox"
            autocomplete="off"
            :checked="checked"
            :id="id"
            :name="name"
        >

        <label class="b-checkbox__label" :for="id">
            <span class="b-checkbox__fake">
                <span class="b-checkbox__fake-mark b-checkbox__fake-mark_style_thin"></span>
            </span>

            <span class="b-checkbox__name">{{ label }}</span>
        </label>
    </span>
</template>

<script>
export default {
    props : [
        'id',
        'name',
        'className',
        'label',
        'checked',
    ],
};
</script>

<style lang="less">
    @import "~b-checkbox/b-checkbox.less";
</style>
