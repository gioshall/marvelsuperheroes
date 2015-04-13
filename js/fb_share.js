(function(ctx) {

  window.fbAsyncInit = function() {
    FB.init({
      appId: '1555659494687013',
      xfbml: true,
      version: 'v2.3'
    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  $('.btn-fb').on('click', function() {
    FB.ui({
      //method: 'share',
      //href: 'http://davidwalsh.name/facebook-meta-tags'
      // method: 'share_open_graph',
      // action_type: 'og.likes',
      // action_properties: JSON.stringify({
      // object:'http://davidwalsh.name/facebook-meta-tags',
      // })
        method: 'feed',
        name: '奧創紀元 ● 復仇者聯盟強勢回歸', // name of the product or content you want to share
        link: 'http://192.168.17.163:24681/', // link back to the product or content you are sharing
        picture: 'http://192.168.17.163:24681/img/fb-og-image.jpg', // path to an image you would like to share with this content
        caption: '搶先化身超級英雄拯救世界', // caption
        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
    },function(response) {
      if (response && response.post_id) {
        console.log('shared');
        $('.act-block.step-01').removeClass('step-01').addClass('step-02');
        $('.act-block .not-share').hide()
        //GO STEP-2
      } else {
        console.log("Not shared");
        $('.act-block .not-share').show()
      }
    });
  });

})(this);