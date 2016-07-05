(function () {

    initBanners();
    initTabs();
    setupTabEnlarger();
    initSticky();
    initSearchFilter();
    publicationsFilter();
    initAccordions();
    initBreadCrumbs();
    initCarousel();
    setupMobileNav();
    setupColumnConform();
    initTouchEvents();
    initOnlineServicesTooltips();

    setupScrollable();

    function setupScrollable() {
        $('.scrollable').each(function () {
            var obj = $(this);
            obj.find('.items').carouFredSel({
                responsive: true,
                auto: {
                    play: false,
                    timeoutDuration: 3000
                },
                items: 1,
                pagination: {
                    container: obj.find('.pagination'),
                    keys: true
                },
                mousewheel: {
                    items: 1
                },
                swipe: {
                    items: 1
                },
                prev: {
                    key: "left"
                },
                next: {
                    key: "right"
                }
            });
        });
    }

    function setupMobileNav() {
        var open = false;
        var pos = 0;
        var scrollElement = $(window);
        var body = $('body');

        $('.btn-navbar').click(function () {
            if (open === true) {
                body.removeClass('nav-open');
                scrollElement.scrollTop(pos);
                open = false;
            }
            else {
                open = true;
                pos = scrollElement.scrollTop();
                scrollElement.scrollTop(0);
                body.addClass('nav-open');
            }
        });
    }

    function initBanners() {
        var currentSelected = 0;

        // Variables
        var bannerContent = $('.banner-container .banner');
        var bannerNavItem = $('.banner-nav a');

        bannerNavItem.click(function (e) {
            e.preventDefault();

            if (!$(this).hasClass('current')) {
                clearInterval(interval);
                selectBanner($(this).index());
            }
        });

        $('.next').click(function (e) {
            e.preventDefault();
            clearInterval(interval);
            currentSelected++;
            if (currentSelected > 2) {
                currentSelected = 0;
            }

            selectBanner(currentSelected);
        });

        $('.prev').click(function (e) {
            e.preventDefault();
            clearInterval(interval);
            currentSelected--;
            if (currentSelected < 0) {
                currentSelected = 2;
            }

            selectBanner(currentSelected);
        });

        function selectBanner(index) {
            currentSelected = index;
            var top = 0;
            if (parseFloat($(document).width()) < 980) {
                top = 15;
            }

            bannerContent.stop(true, true).css({ position: 'static' }).animate({ opacity: 0 }, 1500);

            // Show new image and content
            var newBanner = bannerContent.eq(currentSelected);
            newBanner.stop(true, true).css({ position: 'absolute', top: top, left: 0, right: 0, zIndex: 10, opacity: 0, display: 'block' });


            newBanner.animate({ opacity: 1 }, 1500, function () {
                bannerContent.css({ position: 'static', display: 'none', zIndex: 1 });
                $(this).css({ position: 'static', top: 0, display: 'block', zIndex: 1 });
            });

            // Add/Remove class on banner nav
            bannerNavItem.removeClass('current');
            bannerNavItem.eq(currentSelected).addClass('current');
        }

        var interval = setInterval(function () {
            currentSelected++;
            if (currentSelected > 2) {
                currentSelected = 0;
            }

            selectBanner(currentSelected);
        }, 5000);
    }

    function initSearchFilter() {
        var search = $('#search-filter');

        search.keyup(function () {
            var searchTerm = search.val().toLowerCase();

            $('.box-links').each(function () {
                var counter = 0;

                $(this).find('.block h2').each(function () {
                    if (searchTerm == "") {
                        $(this).parent().show();
                        counter++;
                    }
                    else if ($(this).text().toLowerCase().match(searchTerm)) {
                        $(this).parent().show();
                        counter++;
                    }
                    else if ($(this).data('search') != undefined && $(this).data('search').toString().toLowerCase().match(searchTerm)) {
                        $(this).parent().show();
                        counter++;
                    }
                    else {
                        $(this).parent().hide();
                    }

                    $(this).parent().css({ marginRight: 30 });

                    if (counter == 3) {
                        $(this).parent().css({ marginRight: 0 });
                        counter = 0;
                    }
                });
            });
        });
    }

    function publicationsFilter() {
        var filter = $('.filter');
        var btnFilter = $('.btn-filter');

        btnFilter.click(function (e) {
            e.preventDefault();
            filter.toggle();
            btnFilter.toggleClass('open');
        });

        $(window).resize(function () {
            if (parseFloat($(document).width()) > 767) {
                filter.removeAttr('style');
            }
        });
    }

    function initTabs() {
        $('.tabs').easyResponsiveTabs({
            activate: initCarousel
        });

        // Disable default anchor behaviour
        $('.resp-tabs-list a').click(function (e) {
            e.preventDefault();
        });
    }

    function setupTabEnlarger() {
        $('.tabs').each(function () {
            var tabsWidth;
            var tabContainer = $(this);
            var containerWidth;
            var tabList = tabContainer.find('.resp-tabs-list li');
            var numTabs = tabList.length;
            var useResizer = false;
            var disableResize = false; // Fix issue with ie8 not resizing correctly.

            function resizeTabs() {
                if (!disableResize) {
                    tabsWidth = 0;

                    useResizer = false;
                    tabList.each(function () {
                        var tab = $(this);
                        var link = tab.find('a');

                        //link.width('auto');
                        tabsWidth += (tab.width() + 4);
                        tab.data('width', tab.width());
                        tab.css({ width: 'auto !important' });
                    });

                    containerWidth = tabContainer.width();

                    if (tabsWidth >= containerWidth) {
                        useResizer = true;
                        newTabWidth = (containerWidth / numTabs) - 30;
                        tabList.find('a').css({ width: newTabWidth });

                        tabList.each(function () {
                            $(this).tooltip({
                                items: 'a',
                                content: $(this).find('a').html(),
                                position: {
                                    my: "center bottom-12",
                                    at: "center top",
                                    using: function (position, feedback) {
                                        $(this).css(position);
                                        $("<div>")
									.addClass("arrow")
									.addClass(feedback.vertical)
									.addClass(feedback.horizontal)
									.appendTo(this);
                                    }
                                }
                            });

                            if (($(this).data('width') - 30) < newTabWidth) {
                                $(this).tooltip('disable');
                            }
                        });
                    }
                }
            }

            resizeTabs();
            $(window).resize(resizeTabs);

            tabList.find('a').bind('click touchstart', function () {
                if (useResizer) {
                    disableResize = true;
                    var originalWidth = $(this).parent().data('width');
                    newTabWidth = ((containerWidth - (originalWidth + 30)) / (numTabs - 1) - 30);

                    $(this).parent().parent().find('a').each(function () {
                        $(this).stop(true).animate({ width: newTabWidth });
                        var originalParentWidth = $(this).parent().data('width');

                        if ((originalParentWidth - 30) > newTabWidth) {
                            $(this).parent().tooltip('enable');
                        }
                        else {
                            $(this).parent().tooltip('disable');
                        }
                    });

                    $(this).parent().tooltip('disable');
                    $(this).stop(true).animate({ width: originalWidth }, function () {
                        disableResize = false;
                    });
                }
            });
        });

    }

    function initOnlineServicesTooltips() {
        $('.online-services a').tooltip({
            items: 'a',
            position: {
                my: "center bottom-12",
                at: "center top",
                using: function (position, feedback) {
                    $(this).css(position);
                    $("<div>")
					.addClass("arrow")
					.addClass(feedback.vertical)
					.addClass(feedback.horizontal)
					.appendTo(this);
                }
            }
        });
    }

    function initSticky() {
        $(document).ready(function () {
            $('.stickem-container').stickem();
            getStickyMargin();
        });
    }

    function getStickyMargin() {
        var windowWidth = $(window).width;
        var containerWidth = $('.content-wrap').width;
        var mainContentWidth = $('.main-content-inner');
        var browserGutter = (windowWidth - containerWidth) / 2;

        var leftMargin = browserGutter + mainContentWidth;

        $('.stickem').css({ marginLeft: leftMargin });
    }

    function initAccordions() {
        $('.accordion').on('shown', function () {
            initCarousel();
            $('.in').parent().find('.accordion-toggle').addClass('accordion-active');
        });
        $('.accordion').on('hide', function () {
            $('.in').parent().find('.accordion-toggle').removeClass('accordion-active');
        });
    }

    function initTouchEvents() {
        $('body').bind('touchmove', function () {
            // DO NOT REMOVE
            // Fixes touch devices
        });
    }

    function initCarousel() {
        $('.image_carousel').each(function () {
            var obj = $(this);

            obj.find('.carousel').carouFredSel({
                responsive: true,
                items: 1,
                width: '100%',
                auto: {
                    play: false
                },
                prev: obj.find('.prev'),
                next: obj.find('.next')
            });

        });

        $('.carousel a').fancybox({
            cyclic: true,
            padding: 0,
            onStart: function () {
                if (parseFloat($(document).width()) > 767) {
                    $('.carousel').trigger('pause');
                }
                else {
                    return false;
                }
            },
            onClosed: function () {
                $('.carousel').trigger('play');
            },
            overlayOpacity: 0.8,
            overlayColor: '#000'
        });
    }

    function initBreadCrumbs() {
        (function (w) {
            var crumbsContainer = $('.crumbs-container');
            $(document).ready(function () {
                buildCrumbs();
            });

            function buildCrumbs() {
                $('<a href="#" id="crumbs-trigger">+</a>').appendTo(crumbsContainer);

                $('#crumbs-trigger').bind('click', function (e) {
                    e.preventDefault();
                    var obj = $(this);
                    crumbsContainer.toggleClass('active');

                    if (crumbsContainer.hasClass('active')) {
                        var newHeight = ($('.crumbs-container .crumbs').children().length * 45) + 20;

                        crumbsContainer.height(newHeight);
                        obj.text('-');
                    } else {
                        crumbsContainer.height(45);
                        obj.text('+');
                    }
                });

            }


        })(this);
    }

    function setupColumnConform() {
        function columnConform() {
            var currentTallest = 0,
				 currentRowStart = 0,
				 rowDivs = new Array(),
				 $el,
				 topPosition = 0;
			// Don't need blocks on the iphone
			
			if( !(/iPhone/i.test(navigator.userAgent)) ) {
 
				$('.block').each(function () {

					$el = $(this);
					$el.height('auto');
					topPostion = $el.position().top;

					if (currentRowStart != topPostion) {

						// we just came to a new row.  Set all the heights on the completed row
						for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
							rowDivs[currentDiv].height(currentTallest);
						}

						// set the variables for the new row
						rowDivs.length = 0; // empty the array
						currentRowStart = topPostion;
						currentTallest = $el.height();
						rowDivs.push($el);

					} else {

						// another div on the current row.  Add it to the list and check if it's taller
						rowDivs.push($el);
						currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);

					}

					// do the last row
					for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
						rowDivs[currentDiv].height(currentTallest);
					}

				});
			}
        }

        $(window).resize(columnConform);

        // Dom Ready
        // You might also want to wait until window.onload if images are the things that
        // are unequalizing the blocks
        $(function () {
            columnConform();
        });
    }

})();