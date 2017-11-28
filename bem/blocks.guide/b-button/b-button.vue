<template>
    <buttonWrapper>

        <i v-if="iconLeftClass" :class="iconLeftClass"></i>

        <i v-if="scopedIconLeft" :class="`b-icon b-icon_b-button_${scopedIconLeft} l-margin_right-small`"></i>

        {{ text }}

        <span v-if="notifier" class="b-button__notifier-placeholder">
            <span
                class="b-button__notifier-absolute-wrapper"
                :class="notifierAlign ? `b-button__notifier-absolute-wrapper_align_${notifierAlign}` : ''"
                v-html="notifier"
            ></span>
        </span>

        <i v-if="iconRightClass" :class="iconRightClass"></i>

        <i v-if="scopedIconRight" :class="`b-icon b-icon_b-button_${scopedIconRight } l-margin_left-small`"></i>

    </buttonWrapper>
</template>

<script>
const buttonWrapper = {

    render : function( createElement ) {
        let buttonTag = 'button',
            attrs;

        if ( this.$parent.type === 'button' || this.$parent.type === 'submit' ) {
            buttonTag = 'button';
        }
        else if ( this.$parent.href ) {
            buttonTag = 'a';
            attrs     = {
                href   : this.$parent.href,
                target : this.$parent.target,
            };
        }
        else if ( this.$parent.tag ) {
            buttonTag = this.$parent.tag;
        }

        if ( buttonTag === 'button' ) {
            attrs = {
                type : this.$parent.type || 'button'
            };
        }


        return createElement(
            buttonTag,
            {
                attrs,
                class : this.$parent.allClasses,
                on    : {
                    click : ( event ) => {
                        this.$parent.$emit( 'click', event );
                    },
                },
            },
            this.$slots.default,
        );
    },
};

export default {
    props : {
        color : {
            type    : String,
            default : 'primary',
        },
        size : {
            type    : String,
            default : 'normal',
        },
        text : {
            type    : String,
            default : '',
        },
        isDisabled : {
            type    : Boolean,
            default : false,
        },
        addClass        : String,
        href            : String,
        tag             : String,
        isWide          : Boolean,
        isBlock         : Boolean,
        target          : String,
        type            : String,
        scopedIconLeft  : String, // иконки, которые лежат в моде _b-button блока b-icon
        scopedIconRight : String, // иконки, которые лежат в моде _b-button блока b-icon
        isFontBase      : Boolean,
        radiusNone      : Boolean,
        notifier        : String, // круглые сообщения на кнопки
        notifierAlign   : String, // ориентация круглых сообщений
        iconSingle      : String,
        iconRight       : String,
        iconLeft        : String,
    },

    components : { buttonWrapper },

    computed : {
        className() {
            return `b-button b-button_color_${this.color} b-button_size_${this.size} ${this.addClass}`;
        },
        classStyle() {
            return {
                'b-button_style_wide'     : this.isWide,
                'b-button_style_block'    : this.isBlock,
                'b-button_font_base'      : this.isFontBase,
                'b-button_radius_none'    : this.radiusNone,
                'b-button_state_disabled' : this.isDisabled,
            };
        },
        classIcon() {
            return this.iconSingle ? `b-button_icon_${this.iconSingle}` : '';
        },
        allClasses() {
            return [ this.className, this.classStyle, this.classIcon ];
        },
        iconLeftClass() {
            if ( this.iconLeft === 'corner-down' ) {
                return 'b-button__icon-left b-triangle b-triangle_down';
            }
            else if ( this.iconLeft ) {
                return `b-button__icon-left b-font-regicons b-font-regicons_char_${this.iconLeft}`;
            }
            if ( this.iconSingle ) {
                return `b-font-regicons b-font-regicons_char_${this.iconSingle}`;
            }

            return '';
        },
        iconRightClass() {
            if ( this.iconRight === 'corner-down' ) {
                return 'b-button__icon-left b-triangle b-triangle_down';
            }
            else if ( this.iconRight === 'corner-right' ) {
                return 'b-button__icon-right b-triangle b-triangle_right';
            }
            if ( this.iconRight ) {
                return `b-button__icon-right b-font-regicons b-font-regicons_char_${this.iconRight}`;
            }

            return '';
        },
    },
};
</script>

<style lang="less">
    @import "~b-icon/_b-button/b-icon_b-button.less";
    @import "~b-button/b-button.less";
</style>
