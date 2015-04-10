// countdown

var target_date = new Date("Apr 21, 2015").getTime();
var days, hours, minutes, seconds;
var countdown = document.getElementById("countdown");
 
setInterval(function () {
 
    var current_date = new Date().getTime();
    var seconds_left = (target_date - current_date) / 1000;
 
    days = parseInt(seconds_left / 86400);
    seconds_left = seconds_left % 86400;
     
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
     
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
     
    countdown.innerHTML = "<span>開戰倒數</span><b>" + days + "</b><span>天</span><b>" + hours + "</b><span>時</span><b>"
    + minutes + "</b><span>分</span><b>" + seconds + "</b><span>秒</span>";  
 
}, 1000);

//slideshow

var dHeight = $( document ).height();
$('#slideshow-bg').css('min-height', dHeight)

var bgamt = $('#slideshow-bg div').length;
var rdm = Math.floor(Math.random()*(bgamt-0));
$('#slideshow-bg div:nth-of-type('+ (rdm+1) +')').addClass('active');


function slideSwitch() {
    var $active = $('#slideshow-bg div.active');

    if ( $active.length == 0 ) $active = $('#slideshow-bg div:last');
    var $next =  $active.next().length ? $active.next()
        : $('#slideshow-bg div:first');
        
    $next.addClass('active')
    $active.removeClass('active');
}

$(function() {
    setInterval( "slideSwitch()", 10000 );
});

//video

$('.video-block li.video-01').click(function(){
    $('.video-view').show();
    $('.video-view iframe').attr('src','https://www.youtube.com/embed/ydXUZbrg1nc?rel=0&autoplay=1')   
});
$('.video-block li.video-02').click(function(){
    $('.video-view').show();
    $('.video-view iframe').attr('src','https://www.youtube.com/embed/uSLculV2HWk?rel=0&autoplay=1')   
})

$('.video-view .mask , .video-close').click(function(){
    $('.video-view').hide();
    $('.video-view iframe').attr('src','')
})