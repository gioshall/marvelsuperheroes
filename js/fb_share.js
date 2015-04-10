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
      // method: 'share',
      // href: 'http://davidwalsh.name/facebook-meta-tags'
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
        object:'http://davidwalsh.name/facebook-meta-tags',
      })
    },function(response) {
      if (response && response.post_id) {
        console.log('shared');
        //GO STEP-2
      } else {
        console.log("Not shared");
      }
    });
  });

})(this);