(function( ctx ){
  
  var _moduleName = "Ubitus.GCOnNine";
  
  function _GCOnNine(){
    
    var _contextMethodRegistered = false;
    var _GCPluginPlayer = null;
    var _cachedInitCallback = null;
    var _logger = console;
    var _GCPlayerCallbackHandlers = {};
    var _instance = this;
    
    function _ubiGCPlayerCallback(func , jsonStr){
      _logger.log("# "+ _moduleName +" Log # ubiGCPlayerCallback called, function:'" + func + "'");
      var json = {};
      try{
        json = JSON.parse(jsonStr);
      }catch(e){
        _logger.error("# "+ _moduleName +" Log # Invoke player failed, can't stringify json, exception: " + e.message );
        return false;
      }
      if( _GCPlayerCallbackHandlers[func]  ){
        _GCPlayerCallbackHandlers[func]( json );
        delete _GCPlayerCallbackHandlers[func];
      }else{
        _logger.error("# "+ _moduleName +" Log # No callback handler for '" + func +"', ignore this callback.");
      }
    }
    
    function _ubiGCPlayerCaller( playerInstance, func, json ){
			if(!playerInstance){
				console.log("# "+ _moduleName +" Log # Error! player not found!" );
				return;
			}
			var jsonStr = "";
			try{
				jsonStr = JSON.stringify(json);
			}catch(e){
				_logger.error("# "+ _moduleName +" Log # Invoke player failed, can't stringify json, exception: " + e.message );
				return false;
			}
			_logger.log("# "+ _moduleName +" Log # Invoke player function:'" + func + "'");
			try{
				playerInstance.ubiGCPlayerInvoke( func , jsonStr );
				return true;
			}catch(e){
				_logger.error("# "+ _moduleName +" Log # Invoke player failed, exception: " + e.message );
				return false;
			}
		};
    
    function _ubiGCPlayerInitCallback(code , message){
      _logger.log("# "+ _moduleName +" Log # ubiGCPlayerInitCallback called, code:'" + code + "', message:" + message );
      _cachedInitCallback = { "code" : code, "message" : message };
      if( _GCPlayerCallbackHandlers["init"] ){
        _GCPlayerCallbackHandlers["init"](_cachedInitCallback);
        _cachedInitCallback = null;
        delete _GCPlayerCallbackHandlers["init"];
      }
    }
    
    function _ubiGCPlayerGetCapId(){
			var _id = new Date().getTime();
			return _id + "";
		}
    
    function _registeredContextMethod(){
      ctx.ubiGCPlayerCallback = _ubiGCPlayerCallback;
      ctx.ubiGCPlayerInitCallback = _ubiGCPlayerInitCallback;
    }
    
    this.removeGCPluginPlayer = function(){
      if( !_GCPluginPlayer ){
        _logger.log("# "+ _moduleName +" Log # GCPluginPlayer not exist");
        return false;
      }
      if( _GCPluginPlayer.parentElement ){
        _GCPluginPlayer.parentElement.removeChild(_GCPluginPlayer);
        _GCPluginPlayer = null;
      }
    }
    
    this.appendGCPluginPlayer = function( target, width, height ){
      if( _GCPluginPlayer ){
        _logger.log("# "+ _moduleName +" Log # GCPluginPlayer already exist");
        return false;
      }
      
      if(!_contextMethodRegistered){
        _registeredContextMethod();
        _contextMethodRegistered = true;
      }
      
      if(!/msie/.test(navigator.userAgent.toLowerCase())){
        _GCPluginPlayer = document.createElement("embed");
        _GCPluginPlayer.type = "application/ubitus-gamecloud-product-plugin";
      }else{
        _GCPluginPlayer = document.createElement("object");
        _GCPluginPlayer.classid = "CLSID:CD9D1DAD-2B65-4709-ABC2-12EA3BBA21D8";
      }
      
      _GCPluginPlayer.width = width || 960;
      _GCPluginPlayer.height = height || 540;
      _GCPluginPlayer.id = "ubiPlayerPlugin";
      _GCPluginPlayer.style = "visibility:hidden";
      
      target.appendChild(_GCPluginPlayer);
      return true;
    };
    
    this.intialGCPlayer = function( initialCallback ){
      
      if( !_GCPluginPlayer ){
        _logger.log("# "+ _moduleName +" Log # GCPluginPlayer not exist");
        return false;
      }
      
      initialCallback = initialCallback || function(){};
      
      var _rtn = {
        "successful" : true,
        "code": "200",
        "message": "success"
      };
      
      _GCPlayerCallbackHandlers["init"] = function( initResult ){
        if(initResult.code == "200"){
          _GCPlayerCallbackHandlers["getClientCapability"] = function( capabilityResult ){
            if( capabilityResult.code === "200" ){
              initialCallback(_rtn);
            }else{
              _rtn.successful = false;
              _rtn.code = "7401";
              _rtn.message = "retrieve client capability failed";
              initialCallback(_rtn);
            }
          };
          if( !_ubiGCPlayerCaller(_GCPluginPlayer, "getClientCapability", {"id": _ubiGCPlayerGetCapId() , "type" : "get"} )){
            _rtn.successful = false;
            _rtn.code = "7401";
            _rtn.message = "retrieve client capability failed";
            initialCallback(_rtn);
          }
        }else{
          _rtn.successful = false;
          _rtn.code = "65" + initResult.code;
          _rtn.message = initResult.message;
          initialCallback(_rtn);
        }
      };
      
      if( _cachedInitCallback ){
        setTimeout(function(){
          _GCPlayerCallbackHandlers["init"]( _cachedInitCallback.code, _cachedInitCallback.message );
          _cachedInitCallback = null;
          delete _GCPlayerCallbackHandlers["init"];
        }, 0);
      }
      
      try{
        _GCPluginPlayer.ubiGCPlayerInit();
      }catch(e){
        _rtn.successful = false;
        _rtn.code = "7003";
        _rtn.message = "initial player failed";
        initialCallback(_rtn);
      }
      
      return true;
    };
    
    this.isPluginPlayerInstalled = function(config){
      config = config || {};
      if( this.appendGCPluginPlayer( config.target, config.width, config.height ) ){
        if( _GCPluginPlayer ){
          if( !_GCPluginPlayer.offsetParent ){
            this.removeGCPluginPlayer();
            if( config.callback )
              config.callback( {"successful":false,"code":"7004", "message": "plugin player can't be initialized when nested in display:none element"} );
          }else{
            this.intialGCPlayer( function( initialResult ){
              _instance.removeGCPluginPlayer();
              if( initialResult.code === "200" || initialResult.code === "65301" ){
                if(config.callback)
                  config.callback({"successful":true,"code":"200","message":"success"});
              }else{
                if(config.callback)
                  config.callback(initialResult);
              }
            } );
          }
        }else{
          if( config.callback )
            config.callback( {"successful":false,"code":"7007", "message": "embed player failed or already exist"} );
        }
      }
    };
    
    this.start = function( config ){
      config = config || {};
      switch(config.type){
        case "GCPluginPlayer" : 
          if( this.appendGCPluginPlayer( config.target, config.width, config.height ) ){
            if( _GCPluginPlayer ){
              if( !_GCPluginPlayer.offsetParent ){
                if( config.callback )
                config.callback( {"successful":false,"code":"7004", "message": "plugin player can't be initialized when nested in display:none element"} );
              }else{
                this.intialGCPlayer( config.callback );
              }
            }else{
              if( config.callback )
                config.callback( {"successful":false,"code":"7007", "message": "embed player failed or already exist"} );
            }
          }
        break;
      }
    }
  };
   
  var _instance;
  var _dependencies = [];
  ctx.define(_moduleName, _dependencies, function(){
    if(!_instance)
      _instance = new _GCOnNine();
    return _instance;
  });
  
})(this);