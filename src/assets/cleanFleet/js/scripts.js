$(document).ready(function() {
    addHints();

});


//Control Sticky navigation
var inview = new Waypoint.Inview({
    element: $('#m_header_nav')[0],
    // enter: function(direction) {
    //     //notify('Enter triggered with direction ' + direction)
    //     console.log('Enter triggered with direction ' + direction)
    // },
    entered: function(direction) { //scrolling down and header touches viewport bottom
        //console.log('Entered triggered with direction ' + direction);
        //$('body').removeClass('m-aside-left--fixed m-header--fixed m-header--fixed-mobile');
        $('header').addClass('header--not-fixed');
        $('.cleanFleetHeader').removeClass('noShow');
        $('#m_aside_left').addClass('aside--not-fixed');
        $('#bodyContentWrapper').addClass('grid-aside-not-fixed');
    },
    exit: function(direction) { //scrolling up and header touches the viewport top
        //console.log('Exit triggered with direction ' + direction);
        //$('body').addClass('m-aside-left--fixed m-header--fixed m-header--fixed-mobile');
        $('header').removeClass('header--not-fixed');
        $('.cleanFleetHeader').addClass('noShow');
        $('#m_aside_left').removeClass('aside--not-fixed');
        $('#bodyContentWrapper').removeClass('grid-aside-not-fixed');
    },
    // exited: function(direction) {
    //     console.log('Exited triggered with direction ' + direction)
    // }
})

//switch tabs on click
function SwitchToTab(tabIdentifier) {
    switch (tabIdentifier) {
        case "inventory":
            $('ul#calcToolTabsList > li > .nav-link, ul#calcToolTabsList > li > .dropdown-menu > .dropdown-item').removeClass('active').attr('aria-selected','false');   //remove all 'active classes from tab selectors
            $('.calcTabsBody > div > .tab-pane').removeClass('active'); //remove 'active' class from all tab body items

            $('#m_calculator_tab_1-link').addClass('active').attr('aria-selected','true'); 
            $('#m_calculator_tab_1').addClass('active');
            break;

        case "emissions":
            $('ul#calcToolTabsList > li > .nav-link, ul#calcToolTabsList > li > .dropdown-menu > .dropdown-item').removeClass('active').attr('aria-selected','false');
            $('.calcTabsBody > div > .tab-pane').removeClass('active');

            $('#m_calculator_tab_2-link').addClass('active').attr('aria-selected','true');
            $('#m_calculator_tab_2').addClass('active');
            break;

        case "action1":
            $('ul#calcToolTabsList > li > .nav-link, ul#calcToolTabsList > li > .dropdown-menu > .dropdown-item').removeClass('active').attr('aria-selected','false');
            $('.calcTabsBody > div > .tab-pane').removeClass('active');

            $('#m_calculator_tab_3-link').addClass('active').attr('aria-selected','true');
            $('#m_calculator_tab_3').addClass('active');
            $('#recommenedActions-link').addClass('active');
            break;
    }
}


function addHints(){
    intro = introJs();
    intro.setOptions({
        hints: [
            {
                //element: '#navHint'
                //hint: "Click to start user guide",
                //hintPosition: 'left'
            }
        ]
    });

    intro.addHints();
}


function startIntro(){
    var intro = introJs();
    intro.setOptions({
        showButtons: false,
        steps: [
            // { 
            //     intro: "Hello world!"
            // },
            {
                element: '#navHint',
                intro: "<strong>Walkthrough</strong><br>This walkthrough will guide you on how to use the tool. You can start it any time by clicking on this icon.<br> Navigate using your keyboard arrow keys or clicking on the buttons below."
            },
            {
                element: '#profileLink',
                intro: "<strong>Member Profile</strong><br>You can view your profile here, this will give you access to your saved data and progress update."
            },
            {
                element: '#glossaryLink',
                intro: "<strong>Glossary of Terms</strong><br>Should you come across any new accronyms or terms you don't understand, please refer to our glossary here."
            },
            {
                element: '.m-brand__logo',
                intro: "<strong>Calculator tool / Home</strong><br>Clicking on this icon displays the calculator tool."
            }, 
            {
                element: '.menuHighlight',
                intro: "<strong>Menu</strong><br>This vertical navigation menu allows you to access different areas of the toolkit by clicking on the different icons."
            },           
            {
                element: '#calcToolTabsList',
                intro: "The calculator has several sections, all can be accessed by selecting any tab here.",
                position: 'bottom'
            },
            {
                element: '.toolkitDisclaimer',
                intro: "Please take note of this, its quite important.",
                position: 'top'
            },
            // {
            //     element: document.querySelectorAll('#step2')[0],
            //     intro: "Ok, wasn't that fun?",
            //     position: 'right'
            // },
            // {
            //     element: '#step3',
            //     intro: 'More features, more fun.',
            //     position: 'left'
            // },
            // {
            //     element: '#step4',
            //     intro: "Another step.",
            //     position: 'bottom'
            // },
            // {
            //     element: '#step5',
            //     intro: 'Get it, use it.'
            // }
        ]
    });

    intro.start();
}

//watch for class change events in the introJs navigations
// Create a closure
