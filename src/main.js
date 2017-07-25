import AdaptData from '@adapt-retail/adapt-api';
import mustache from 'mustache';
import Swipe from 'swipejs';

var shouldDebug = false;
var debug = function( output ) {
    if (shouldDebug) {
        console.log(output);
    }
}

// Prepare adapt data
var adaptData = new AdaptData( {
    account: 'priceco58c12436f20b4',
    project: 1,
    campaign: 1,
    production: 1,
} );

var insertHtml = function(element, html) {
    element.insertAdjacentHTML( 'beforeEnd', html );
};

var itemIndexCarousel = function( index ) {
    if (index < 0) {
        return items.length -1;
    }
    else if (index >= items.length) {
        return 0;
    }
    return index;
};


var items = [];
var startItem = 0;

// Prepare views
var productTemplate = require( './views/product.template.html' );
var bannerContainer = document.getElementById( 'adaptBanner' );

// Add Html
insertHtml( document.querySelector( 'head' ), require( './views/head.template.html' ) );
insertHtml( bannerContainer, require( './views/container.template.html' ) );

var swipeWrap = document.querySelector( '.swipe-wrap' );
var slider = document.getElementById('slider');

// Run init when DOM is ready
document.addEventListener( "DOMContentLoaded", function(e) {

    adaptData.start( function( data ) {
        debug(data);
        items = Object.keys( data.data ).map( function(key) {
            return data.data[key];
        } ).map( function(item) {
            item.image = adaptData.asset( item.image );
            item.vendorlogo = adaptData.asset( item.vendorlogo );
            item.pricematch = item.pricematch === "1";
            item.threefortwo = item.threefortwo === "1";
            item.description = item.descriptionshort;
            debug(item);
            return item;
        } );

        // Innsert all products to swiper
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var content = mustache.render( productTemplate, item );
            insertHtml( swipeWrap, content );
        }

        // Init swipe
        window.mySwipe = new Swipe(slider, {
            callback: function(index, element, direction, isInteraction) {
                var to = items[index];
                var from = items[ itemIndexCarousel( index + direction ) ];
                debug( from.name + ' -> ' + to.name );

                var itemid = to.id;


                //This is called on human/touch swipe
                if (isInteraction) {
                    // if (adform) {
                        // dhtml.sendEvent(4, 'Next');
                    // }
                    // event('Next',itemid);
                    window.mySwipe.stop(); // This does not work. (Something wrong with SwipeJs?)
                }
            },
            speed: 400,
            draggable: true,
            auto: 4000,

            autoRestart: true,

            startSlide: startItem
        });

    } );

} );
