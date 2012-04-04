function ResourceManager(stage) {
	var self = this;
	this.loader;
	this.stage = stage;
  this.resource =new Array;

	this.init = function(){
	 //setup resource loader
    this.loader = new PxLoader();
    this.resource =new Array;
    this.loader.addProgressListener(this.resProgressListener);
    this.loader.addCompletionListener(this.resCompleteListener);
	   this.loadResource();
	}

	this.loadResource = function(){
    for(var i=0; i < resourceList.length; i++) {
      switch (resourceList[i].type){
      case 'img':
        var pxImage = new PxLoaderImage(resourceList[i].url); 
        pxImage.label = resourceList[i].imageLabel;
        this.loader.add(pxImage);
      break;
      case 'snd':
        var pxSound = new PxLoaderSound(resourceList[i].soundLabel,resourceList[i].url);
        this.loader.add(pxSound);
      break;
      case 'vid':
        var pxVideo = new PxLoaderVideo(resourceList[i].url);
        pxVideo.label = resourceList[i].videoLabel;
        this.loader.add(pxVideo);
      break;
      }
    } 
    this.loader.start();
  }

  this.resProgressListener = function(e){
    var text = new Text ("","20px arial","#000");
    text.text = "loading resource ("+e.completedCount + "/" +e.totalCount+")";
    text.x = vnEngine.canvas.width/2-text.getMeasuredWidth()/2;
    text.y = vnEngine.canvas.height/2;

    self.resource.push(e.resource);
    self.stage.removeAllChildren();
    self.stage.addChild(text);
  }

  this.resCompleteListener = function(){
    self.stage.removeAllChildren();
    vnEngine.scriptCounter = 0;
    vnEngine.checkScript();
  }

  this.getResource = function(label) {
  for (var i = 0; i < self.resource.length; i++) {
      if (self.resource[i].label == label) {
          return self.resource[i];
      }
  }
  return false;
  }
}