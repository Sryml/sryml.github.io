/**
 * some JavaScript code for this blog theme
 */
/* jshint asi:true */

/////////////////////////header////////////////////////////
/**
 * clickMenu
 */
(function() {
  if (window.innerWidth <= 770) {
    var menuBtn = document.querySelector('#headerMenu')
    var nav = document.querySelector('#headerNav')
    menuBtn.onclick = function(e) {
      e.stopPropagation()
      if (menuBtn.classList.contains('active')) {
        menuBtn.classList.remove('active')
        nav.classList.remove('nav-show')
      } else {
        nav.classList.add('nav-show')
        menuBtn.classList.add('active')
      }
    }
    document.querySelector('body').addEventListener('click', function() {
      nav.classList.remove('nav-show')
      menuBtn.classList.remove('active')
    })
  }
}());

//////////////////////////back to top////////////////////////////
(function() {
  var backToTop = document.querySelector('.back-to-top')
  var backToTopA = document.querySelector('.back-to-top a')
  // console.log(backToTop);
  window.addEventListener('scroll', function() {

    // 页面顶部滚进去的距离
    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)

    if (scrollTop > 200) {
      backToTop.classList.add('back-to-top-show')
    } else {
      backToTop.classList.remove('back-to-top-show')
    }
  })

  // backToTopA.addEventListener('click',function (e) {
  //     e.preventDefault()
  //     window.scrollTo(0,0)
  // })
}());

//////////////////////////hover on demo//////////////////////////////
(function() {
  var demoItems = document.querySelectorAll('.grid-item')
}());

////////////// View original image //////////////
(function() {
  //图片放大  
  $("#outerdiv").hide();
  $(function(){  
  // $("img").mouseover(function(){
  //     $(this).css("cursor","zoom-in"); //pointer
  // });

  $("img").click(function(){  
      var _this = $(this);//将当前的pimg元素作为_this传入函数    
      imgShow("#outerdiv", "#bigimg", _this);    
    });     
  });    

  function imgShow(outerdiv, bigimg, _this){  
      var src = _this.attr("src");//获取当前点击的pimg元素中的src属性    
      $('#outerdiv').attr('display','block');  
      $(bigimg).attr("src", src);//设置#bigimg元素的src属性   
      var window_width = $(window).width();
      var window_height = $(window).height();
      // var img_width = $(_this).width();
      // var img_height = $(_this).height();
      // alert(img_width);
      // alert(img_height);
      $(outerdiv).fadeIn("fast")
    };  
      
  $(outerdiv).click(function(){//再次点击淡出消失弹出层    
      $(this).fadeOut("fast");    
  });
}());