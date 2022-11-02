let Slider = function ( id ){
  this.slider = document.getElementById( id );
  this.slideList = this.slider.getElementsByClassName('js-slide-list')[0];
  this.slideListItems = this.slider.getElementsByClassName('js-slide-list-item');
  this.slideWidth = this.slideListItems[0].offsetWidth;
  this.slidesLength = this.slideListItems.length; 
  this.current = 1;
  this.direction;
  this.animating = false;
};
Slider.prototype = {
  constructor : Slider,
  init : function(){
    this.listenEvents();
    this.cloneFirstAndLastItem();
  },
  listenEvents : function(){
    let that = this;
    let arrowButtons = this.slider.getElementsByClassName('js-arrow-button');
    for (let i = 0; i < arrowButtons.length; i++) {
      arrowButtons[i].addEventListener('click', function(){
        that.clickArrowButton( this );
      });
    };
    let pagerItems = this.slider.getElementsByClassName('js-pager-item');
    for (let i = 0; i < pagerItems.length; i++){
      pagerItems[i].addEventListener('click', function(){
        that.clickPagerItem( this );
      });
    };
  },
  cloneFirstAndLastItem : function(){
    let firstSlide = this.slideListItems[0];
    let lastSlide = this.slideListItems[ this.slidesLength - 1 ];
    let firstSlideClone = firstSlide.cloneNode( true );
    let lastSlideClone = lastSlide.cloneNode( true );
    
    firstSlideClone.removeAttribute('data-slide-index');
    lastSlideClone.removeAttribute('data-slide-index');
    
    this.slideList.appendChild( firstSlideClone );
    this.slideList.insertBefore( lastSlideClone, firstSlide );
  },
  clickArrowButton : function( el ){
    let direction = el.getAttribute('data-direction');
    let pos = parseInt( this.slideList.style.left ) || 0;
    let newPos; 
    this.direction = direction === 'prev' ? -1 : 1;
    newPos = pos + ( -1 * 100 * this.direction );
    if( !this.animating ) {
      this.slideTo(this.slideList, function( progress ){
        return Math.pow(progress, 2);
      }, pos, newPos, 500);
      this.current += this.direction;
    }
  },
  clickPagerItem : function( el ){
    let slideIndex = el.getAttribute('data-slide-index');
    let targetSlide = this.slider.querySelector('.js-slide-list-item[data-slide-index="' + slideIndex +'"]');
    let pos = parseInt( this.slideList.style.left ) || 0;
    let newPos = Math.round( targetSlide.offsetLeft / targetSlide.offsetWidth ) * 100 * -1;
    
    if( !this.animating && pos !== newPos ){
      this.slideTo(this.slideList, function( progress ){
        return Math.pow(progress, 2);
      }, pos, newPos, 500);
      this.current = parseInt(slideIndex) + 1;
    }
  },
  slideTo : function( element, deltaFunc, pos, newPos, duration ){
   this.animating = true;
   this.animate({
     delay: 20,
     duration: duration || 1000,
     deltaFunc: deltaFunc,
     step: function( delta ){
       let direction = pos > newPos ? 1 : -1
       element.style.left = pos  + Math.abs(newPos - pos) * delta * direction * -1 + '%';
     }
   }); 
  },
  animate : function( opts ){
    let that = this;
    let start = new Date();
    let id = setInterval(function(){
      let timePassed = new Date - start;
      let progress = timePassed / opts.duration;
      if( progress > 1 ) {
        progress = 1;
      }
      let delta = opts.deltaFunc( progress );
      opts.step( delta );
      if( progress === 1 ){
        clearInterval( id );
        that.animating = false;
        that.checkCurrentSlide();
      }
    }, opts.delay || 10 );
  },
  checkCurrentSlide : function( ){
    let cycle = false;
    cycle = !!( this.current === 0 || this.current > this.slidesLength )
    if ( cycle ) {
      this.current = ( this.current === 0 ) ? this.slidesLength : 1;
      this.slideList.style.left = ( -1 * this.current * 100 ) + '%';
    } 
    
  }
};
document.addEventListener('DOMContentLoaded', function(){
    new Slider('categorySlider').init();
})