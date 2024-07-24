 
(function() {
  "use strict";
 
   
  $(document).ready(function() {
    $('.minus').click(function () {
       var $input = $(this).parent().find('input');
       var count = parseInt($input.val()) - 1;
       count = count < 1 ? 1 : count;
       $input.val(count);
       $input.change();
       return false;
    });
    $('.plus').click(function () {
       var $input = $(this).parent().find('input');
       $input.val(parseInt($input.val()) + 1);
       $input.change();
       return false;
    });
 });



$(".banner_sider").owlCarousel({
   autoplay: false,
   autoplayHoverPause: true,
   autoplayTimeout: 100,
   autoWidth:false,
   dots: false, 
   loop: true,
   nav: true, 
   stagePadding: 0,
   margin:0,
   items: 1
 });

 $(".featured_slider").owlCarousel({
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 1000,
  autoWidth:false,
  dots: false, 
  loop: true,
  nav: false,  
  fade: true,
  items: 6,
  responsive : {  
        768 : { 
          items: 3,
        }, 
        1024 : { 
          items: 4,
        }, 
        1200 : { 
          items: 6,
        }
  }
});

$(".brands_slider").owlCarousel({
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  autoWidth:false,
  dots: false, 
  loop: true,
  nav: false,  
  fade: true,
  items: 5,
  responsive : {  
      768 : { 
        items: 3,
      }, 
      1024 : { 
        items: 4,
      }, 
      1200 : { 
        items: 5,
      }
  }
});

$(".related_product").owlCarousel({
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  autoWidth:false,
  dots: false, 
  loop: true,
  nav: true,  
  fade: true,
  margin: 15,
  items: 4,
    responsive : {  
      768 : { 
        items: 2,
        nav: false,
      }, 
      1024 : { 
        items: 3,
        nav: false,  
      }, 
      1200 : { 
        items: 4,
      }
  }
});
 
 

 let min = 10;
let max = 100;

const calcLeftPosition = value => 100 / (100 - 10) *  (value - 10);

$('#rangeMin').on('input', function(e) {
  const newValue = parseInt(e.target.value);
  if (newValue > max) return;
  min = newValue;
  $('#thumbMin').css('left', calcLeftPosition(newValue) + '%');
  $('#min').html(newValue);
  $('#line').css({
    'left': calcLeftPosition(newValue) + '%',
    'right': (100 - calcLeftPosition(max)) + '%'
  });
});

$('#rangeMax').on('input', function(e) {
  const newValue = parseInt(e.target.value);
  if (newValue < min) return;
  max = newValue;
  $('#thumbMax').css('left', calcLeftPosition(newValue) + '%');
  $('#max').html(newValue);
  $('#line').css({
    'left': calcLeftPosition(min) + '%',
    'right': (100 - calcLeftPosition(newValue)) + '%'
  });
});
  
$(document).ready(function () {
   $('.fav_btn').on('click', function () { 
     $(this).toggleClass('change_btn'); 
   })
});
  

$(document).ready(function() {

    
  var readURL = function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('.profile-pic').attr('src', e.target.result);
          }
  
          reader.readAsDataURL(input.files[0]);
      }
  }
  

  $(".file-upload").on('change', function(){
      readURL(this);
  });
  
  $(".upload-button").on('click', function() {
     $(".file-upload").click();
  });
});


$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});


$(document).ready(function () {
  $('.mobile_menu_btn').on('click', function () { 
    $('.menus').toggleClass('show_menus'); 
    $('.mobile_menu_btn').toggleClass('icon_changes'); 
  })
});


$(document).ready(function () {
  $('.category_btn').on('click', function () { 
    $('.categories_main').toggleClass('show_category');  
  }) 
});


$(document).ready(function(){
  var windowWidth = $(window).width();
  if(windowWidth <= 1023)
     $('.product_single_left .collapse').removeClass('show')
});
 
$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  if (scroll >= 40) {
      $(".header_main").addClass("header-fixed");
  } else {
      $(".header_main").removeClass("header-fixed");
  }
});


})();