var PortletTools = function () {
    //== Toastr
    var initToastr = function() {
        toastr.options.showDuration = 1000;
    }
    

    //== portlet 1
    var portlet1 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_1').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                overlayColor: '#4E7CA5',
                type: 'loader',
                state: 'accent',
                opacity: 0.3,
                size: 'lg'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            ////toastr.info('After fullscreen on event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }

    //== portlet 2
    var portlet2 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_2').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                overlayColor: '#000000',
                type: 'spinner',
                state: 'brand',
                opacity: 0.05,
                size: 'lg'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
    }

    //== portlet 3
    var portlet3 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_3').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'success',
                message: 'Please wait...'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            ////toastr.info('After fullscreen on event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }
 
    //== portlet 4
    var portlet4 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_4').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            ////toastr.info('After fullscreen on event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');

            var scrollable = portlet.getBody().find('> .m-scrollable');

            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }

    //== portlet 5
    var portlet5 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_5').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            //toastr.info('After fullscreen on event fired!');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');
        });
    }

    //== portlet 5
    var portlet6 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_6').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            //toastr.info('After fullscreen on event fired!');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');
        });
    }

    //== portlet 7
    var portlet6 = function() {
        // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
        var portlet = $('#m_portlet_tools_7').mPortlet();

        //== Toggle event handlers
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before collapse event fired!');
            }, 100);
        });

        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                //toastr.warning('Before collapse event fired!');
            }, 2000);            
        });

        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                //toastr.info('Before expand event fired!');
            }, 100);  
        });

        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After expand event fired!');
            }, 2000);
        });

        //== Remove event handlers
        portlet.on('beforeRemove', function(portlet) {
            //toastr.info('Before remove event fired!');

            return confirm('Are you sure to remove this portlet ?');  // remove portlet after user confirmation
        });

        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                //toastr.warning('After remove event fired!');
            }, 2000);            
        });

        //== Reload event handlers
        portlet.on('reload', function(portlet) {
            //toastr.info('Leload event fired!');

            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });

            // update the content here

            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });

        //== Reload event handlers
        portlet.on('afterFullscreenOn', function(portlet) {
            //toastr.info('After fullscreen on event fired!');
            mApp.initScroller(scrollable, {});
        });

        portlet.on('afterFullscreenOff', function(portlet) {
            //toastr.warning('After fullscreen off event fired!');
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            initToastr();

            // init portlets
            portlet1();
            portlet2();
            portlet3();
            portlet4();
            portlet5();
            portlet6();
        }
    };
}();

jQuery(document).ready(function() {
    PortletTools.init();
});