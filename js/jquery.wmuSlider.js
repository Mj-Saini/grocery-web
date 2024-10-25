/*!
 * jQuery wmuSlider v2.1
 * 
 * Copyright (c) 2011 Brice Lechatellier
 * http://brice.lechatellier.com/
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

;(function(INR) {
    
    INR.fn.wmuSlider = function(options) {

        /* Default Options
        ================================================== */       
        var defaults = {
            animation: 'fade',
            animationDuration: 600,
            slideshow: true,
            slideshowSpeed: 7000,
            slideToStart: 0,
            navigationControl: true,
            paginationControl: true,
            previousText: 'Previous',
            nextText: 'Next',
            touch: false,
            slide: 'article',
            items: 1
        };
        var options = INR.extend(defaults, options);
        
        return this.each(function() {

            /* Variables
            ================================================== */
            var INRthis = INR(this);
            var currentIndex = options.slideToStart;
            var wrapper = INRthis.find('.wmuSliderWrapper');
            var slides = INRthis.find(options.slide);
            var slidesCount = slides.length;
            var slideshowTimeout;
            var paginationControl;
            var isAnimating;
            
            
            /* Load Slide
            ================================================== */ 
            var loadSlide = function(index, infinite, touch) {
                if (isAnimating) {
                    return false;
                }
                isAnimating = true;
                currentIndex = index;
                var slide = INR(slides[index]);
                INRthis.animate({ height: slide.innerHeight() });
                if (options.animation == 'fade') {
                    slides.css({
                        position: 'absolute',
                        opacity: 0
                    });
                    slide.css('position', 'relative');
                    slide.animate({ opacity:1 }, options.animationDuration, function() {
                        isAnimating = false;
                    });
                } else if (options.animation == 'slide') {
                    if (!infinite) {
                        wrapper.animate({ marginLeft: -INRthis.width() / options.items * index }, options.animationDuration, function() {
                            isAnimating = false;
                        });
                    } else {
                        if (index == 0) {
                            wrapper.animate({ marginLeft: -INRthis.width() / options.items * slidesCount }, options.animationDuration, function() {
                                wrapper.css('marginLeft', 0);
                                isAnimating = false;
                            });
                        } else {
                            if (!touch) {
                                wrapper.css('marginLeft', -INRthis.width() / options.items * slidesCount);
                            }
                            wrapper.animate({ marginLeft: -INRthis.width() / options.items * index }, options.animationDuration, function() {
                                isAnimating = false;
                            });
                        }
                    }
                }

                if (paginationControl) {
                    paginationControl.find('a').each(function(i) {
                        if(i == index) {
                            INR(this).addClass('wmuActive');
                        } else {
                            INR(this).removeClass('wmuActive');
                        }
                    });
                }    
                                                    
                // Trigger Event
                INRthis.trigger('slideLoaded', index);             
            };
            
        
            /* Navigation Control
            ================================================== */ 
       /*--  if (options.navigationControl) {
                var prev = INR('<a class="wmuSliderPrev">' + options.previousText + '</a>');
                prev.click(function(e) {
                    e.preventDefault();
                    clearTimeout(slideshowTimeout);
                    if (currentIndex == 0) {
                        loadSlide(slidesCount - 1, true);
                    } else {
                        loadSlide(currentIndex - 1);
                    }
                });
                INRthis.append(prev);
                
                var next = INR('<a class="wmuSliderNext">' + options.nextText + '</a>');
                next.click(function(e) {
                    e.preventDefault();
                    clearTimeout(slideshowTimeout);
                    if (currentIndex + 1 == slidesCount) {    
                        loadSlide(0, true);
                    } else {
                        loadSlide(currentIndex + 1);
                    }
                });                
                INRthis.append(next);
            }
         --*/

            /* Pagination Control
            ================================================== */ 
            if (options.paginationControl) {
                paginationControl = INR('<ul class="wmuSliderPagination"></ul>');
                INR.each(slides, function(i) {
                    paginationControl.append('<li><a href="#">' + i + '</a></li>');
                    paginationControl.find('a:eq(' + i + ')').click(function(e) {    
                        e.preventDefault();
                        clearTimeout(slideshowTimeout);   
                        loadSlide(i);
                    });                
                });
                INRthis.append(paginationControl);
            }
            
            
            /* Slideshow
            ================================================== */ 
            if (options.slideshow) {
                var slideshow = function() {
                    if (currentIndex + 1 < slidesCount) {
                        loadSlide(currentIndex + 1);
                    } else {
                        loadSlide(0, true);
                    }
                    slideshowTimeout = setTimeout(slideshow, options.slideshowSpeed);
                }
                slideshowTimeout = setTimeout(slideshow, options.slideshowSpeed);
            }
            
                        
            /* Resize Slider
            ================================================== */ 
            var resize = function() {
                var slide = INR(slides[currentIndex]);
                INRthis.animate({ height: slide.innerHeight() });
                if (options.animation == 'slide') {
                    slides.css({
                        width: INRthis.width() / options.items
                    });
                    wrapper.css({
                        marginLeft: -INRthis.width() / options.items * currentIndex,
                        width: INRthis.width() * slides.length
                    });                    
                }    
            };
            
                        
            /* Touch
            ================================================== */
            var touchSwipe = function(event, phase, direction, distance) {
                clearTimeout(slideshowTimeout);              
                if(phase == 'move' && (direction == 'left' || direction == 'right')) {
                    if (direction == 'right') {
                        if (currentIndex == 0) {
                            wrapper.css('marginLeft', (-slidesCount * INRthis.width() / options.items) + distance);
                        } else {
                            wrapper.css('marginLeft', (-currentIndex * INRthis.width() / options.items) + distance);
                        }
                    } else if (direction == 'left') {
                        wrapper.css('marginLeft', (-currentIndex * INRthis.width() / options.items) - distance);
                    }
                } else if (phase == 'cancel' ) {
                    if (direction == 'right' && currentIndex == 0) {
                        wrapper.animate({ marginLeft: -slidesCount * INRthis.width() / options.items }, options.animationDuration);                
                    } else {
                        wrapper.animate({ marginLeft: -currentIndex * INRthis.width() / options.items }, options.animationDuration);  
                    }
                } else if (phase == 'end' ) {
                    if (direction == 'right') {
                        if (currentIndex == 0) {
                            loadSlide(slidesCount - 1, true, true);
                        } else {
                            loadSlide(currentIndex - 1);
                        }
                    } else if (direction == 'left')    {        
                        if (currentIndex + 1 == slidesCount) {
                            loadSlide(0, true);
                        } else {
                            loadSlide(currentIndex + 1);
                        }
                    } else {
                        wrapper.animate({ marginLeft: -currentIndex * INRthis.width() / options.items }, options.animationDuration);
                    }
                }            
            };
            if (options.touch && options.animation == 'slide') {
                if (!INR.isFunction(INR.fn.swipe)) {
                    INR.ajax({
                        url: 'jquery.touchSwipe.min.js',
                        async: false
                    });
                }
                if (INR.isFunction(INR.fn.swipe)) {
                    INRthis.swipe({ triggerOnTouchEnd:false, swipeStatus:touchSwipe, allowPageScroll:'vertical' });
                }
            }
            
            
            /* Init Slider
            ================================================== */ 
            var init = function() {
                var slide = INR(slides[currentIndex]);
                var img = slide.find('img');
                img.load(function() {
                    wrapper.show();
                    INRthis.animate({ height: slide.innerHeight() });
                });
                if (options.animation == 'fade') {
                    slides.css({
                        position: 'absolute',
                        width: '100%',
                        opacity: 0
                    });
                    INR(slides[currentIndex]).css('position', 'relative');
                } else if (options.animation == 'slide') {
                    if (options.items > slidesCount) {
                        options.items = slidesCount;
                    }
                    slides.css('float', 'left');                    
                    slides.each(function(i){
                        var slide = INR(this);
                        slide.attr('data-index', i);
                    });
                    for(var i = 0; i < options.items; i++) {
                        wrapper.append(INR(slides[i]).clone());
                    }
                    slides = INRthis.find(options.slide);
                }
                resize();
                
                INRthis.trigger('hasLoaded');
                
                loadSlide(currentIndex);
            }
            init();
            
                                                
            /* Bind Events
            ================================================== */
            // Resize
            INR(window).resize(resize);
            
            // Load Slide
            INRthis.bind('loadSlide', function(e, i) {
                clearTimeout(slideshowTimeout);
                loadSlide(i);
            });
                        
        });
    }
    
})(jQuery);