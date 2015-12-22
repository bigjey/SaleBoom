(function(){
/*
  $(".sidebar-in").stick_in_parent({
    parent: $('.l-content'),
    offset_top: 20,
    bottoming: true
  });
*/
  $(document).on('click', '[data-action="show-nav"]', function(e){
    e.preventDefault();
    $('body').addClass('show-nav');
  })

  $(document).on('click', '[data-action="hide-nav"]', function(e){
    e.preventDefault();
    $('body').removeClass('show-nav');
  })

  $(document).on('click', '[data-action="hide-auth"]', function(e){
    e.preventDefault();
    $('body').removeClass('show-auth');
    $('[data-auth-tab]').removeClass('active');
  })

  $('[data-action="show-auth"]').on('click', function(e){
    e.preventDefault();
    var tab = $(this).data('auth-tab') || 'login';
    console.log(tab);
    $('[data-auth-tab]').removeClass('active').filter('[data-auth-tab="'+tab+'"]').addClass('active');
    if (!$('body').hasClass('show-auth')){
      $('body').addClass('show-auth show-nav');
    }
  })

  $(document).on('click', function(e){

    if (!$(e.target).is('.auth-popup') && !$(e.target).is('[data-auth-tab]') && $(e.target).closest('.auth-popup').length == 0){
      $('body').removeClass('show-auth');    

      if (!$(e.target).is('.l-sidebar') && !$(e.target).is('[data-action="show-nav"]') && $(e.target).closest('.l-sidebar').length == 0 && $(e.target).closest('[data-action="show-nav"]').length == 0){
        $('body').removeClass('show-nav');
        
      }
    }

  })

  // + promo-carousel

  var $frame  = $('#promo-carousel');
  var $slidee = $frame.children('.slidee').eq(0);
  var $wrap   = $frame.parent();

  $frame.sly({
    horizontal: 1,
    itemNav: 'basic',
    activateOn: 'click',
    touchDragging: 1,
    releaseSwing: 1,    
    speed: 650,
    elasticBounds: 1,
    cycleBy: 'pages',
    cycleInterval: 5000,
    pauseOnHover: true,
    
    prevPage: $wrap.find('.prev'),
    nextPage: $wrap.find('.next')
  });

  // - promo-carousel

  $(window).on('resize', windowResize);

  //$(document).on('scroll', windowScroll);

  function windowResize(){

    $frame.sly('reload');

    salvattore.rescanMediaQueries();

    /*$('[data-window-height]').each(function(i, box){      

      $(box).height(parseInt($(window).height()) + parseInt($(box).data('window-height')));
    })*/

  }
/*
  var $sidebar = $('.l-sidebar');
  function windowScroll(){

    var st = $(document).scrollTop();
    

    if (st >= $sidebar.offset().top){
      $sidebar.not('fixed').addClass('fixed');
    } else {
      $sidebar.filter('.fixed').removeClass('fixed');
    }

  }
*/
})()