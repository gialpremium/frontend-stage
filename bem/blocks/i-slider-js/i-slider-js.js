window.Slideshow = {
    Utils : {
        siblings : function( element ) {
            var parent = element.parentNode,
                childs = parent.children,
                sibls = [],
                len = childs.length,
                i;

            for ( i = 0; i < len; i++ ) {
                var child = childs[i];

                if ( child.nodeType == 1 ) {
                    sibls.push( child );
                }
            }
            
            return sibls;
        },
        hideAll : function( elements, c ) {
            var len = elements.length,
                i;

            for ( i = 0; i < len; i++ ) {
                var element = elements[i],
                    classes = element.className;

                Slideshow.Utils.removeClass( element, c );

            }
        },
        show : function( element, c ) {
            element.className += ' ' + c;
        },
        removeClass : function( el, c ) {
            var elClass = ' ' + el.className + ' ';

            while ( elClass.indexOf( ' ' + c + ' ' ) != -1 ) {
                elClass = elClass.replace( ' ' + c + ' ', '' );
            }
            el.className = elClass;
        },
    },
    core : {
        displayNavigation : function( o ) {
            var wrapper = document.getElementById( o.slidesWrapperId );

            if ( !wrapper ) {
                return false;
            }

            var slides = wrapper.children,
                len = slides.length,
                i,
                nav = document.getElementById( o.slideNavId ),
                html = '';

            for ( i = 0; i < len; i++ ) {
                html += '<a href="#" data-slide="' + i + '" class="' + o.slideNavClass + '">' + ( i + 1 ) + '</a>';
            }
            slides[0].className += ' ' + o.slideCurrentClass;

            nav.innerHTML = html;
        },
        navigate : function( o ) {
            var nav = document.getElementById( o.slideNavId );

            if ( !nav ) {
                return false;
            }

            var links = nav.getElementsByTagName('a'),
                len = links.length,
                i;

            for ( i = 0; i < len; i++ ) {
                var a = links[i];

                a.onclick = function() {

                    var $i = this.getAttribute('data-slide'),
                        slide = document.getElementById( o.slidesWrapperId ).children[$i],
                        siblingsSlides = Slideshow.Utils.siblings( slide ),
                        siblingsNav = Slideshow.Utils.siblings( this );

                    Slideshow.Utils.hideAll( siblingsSlides, o.slideCurrentClass );
                    Slideshow.Utils.show( slide, o.slideCurrentClass );

                    for ( var i = 0; i < siblingsNav.length; i++ ) {
                        siblingsNav[i].className = o.slideNavClass;
                    }

                    this.className = o.slideNavCurrentClass + ' ' + o.slideNavClass;
                    
                    return false;
                };
            }
            links[0].className += ' ' + o.slideNavCurrentClass;
        },
    },
    init : function( o ) {
        for ( var prop in this.core ) {
            if ( typeof this.core[prop] === 'function' ) {
                this.core[prop]( o );
            }
        }
    },
};
