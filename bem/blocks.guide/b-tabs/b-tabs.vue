<template>
    <div class="b-tabs"
        :class="`b-tabs_type_${type} b-tabs_color_${tabsColor} b-tabs_size_${size}`"
    >
        <slot name="before"></slot>

        <div class="b-tabs__titles">
            <div class="b-tabs__item-title" v-for="(tab, i) in tabs"
                :class="{ 'b-tabs__item-title_state_current' : currentTab === i }"
                v-if="$slots[i]"
                @click="currentTab = i"
            >{{ tab }}</div>
        </div>

        <div class="b-tabs__content" :class="contentClass">
            <div v-for="(tab, i) in tabs"
                class="b-tabs__item-content"
                :class="{ 'b-tabs__item-content_state_current' : currentTab === i }"
            >
                <slot :name="i"></slot>
            </div>
        </div>

        <div class="b-tabs__clear"></div>
    </div>
</template>

<script>
export default {
    name  : 'bTabs',
    props : {
        tabs         : Array,
        contentClass : String,
        type         : {
            type    : String,
            default : 'horizontal',
        },
        tabsColor : {
            type    : String,
            default : 'default',
        },
        size : {
            type    : String,
            default : 'normal',
        },
    },
    data() {
        return { currentTab: 0 };
    },
};
</script>

<style lang="less">
    @import "~b-tabs/b-tabs.less";
</style>
