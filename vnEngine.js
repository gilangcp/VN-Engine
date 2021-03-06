/*
*vnEngine.js
*Main file that implements Visual Novel typical function
*
* 2012 Gilang Charismadiptya Prashasta
* free to use and modified
*/
function VnEngine(){
  var self = this;
  
  this.canvas;
  this.stage;
  this.context;

  this.resourceManager;
  this.soundController;
  this.graphicsManager;
  this.stateManager;

  this.initGame = function(canvasId){
      // initialize the sound manager 
      soundManager.url = 'soundManager2/'; 
      soundManager.flashVersion = 9; 
      soundManager.useHighPerformance = true; // reduces delays 
       
      // reduce the default 1 sec delay to 500 ms 
      soundManager.flashLoadTimeout = 500; 
       
      // mp3 is required by default, but we don't want any requirements 
      soundManager.audioFormats.mp3.required = true; 
       
      // flash may timeout if not installed or when flashblock is installed 
      soundManager.ontimeout(function(status) { 
          // no flash, go with HTML5 audio 
          soundManager.useHTML5Audio = true; 
          soundManager.preferFlash = false; 
          soundManager.reboot(); 
      }); 

      soundManager.onready(function() { 
        //Bind canvas to easel JS
        vnEngine.canvas = document.getElementById(canvasId);
        document.getElementById(canvasId).oncontextmenu=new Function ("return false");
        vnEngine.context = vnEngine.canvas.getContext("2d");

        //setup sound Controller ,GraphicsManager and stateManager
        vnEngine.graphicsManager = new GraphicsManager();
        vnEngine.soundController = new SoundController(); 
        vnEngine.stateManager = new StateManager();

        //Check Script for any jump & flag
        //Put every jump label into array 
        vnEngine.stateManager.initScript();

        //create & configure easel js canvas  
        vnEngine.stage = new Stage(vnEngine.canvas);
        vnEngine.stage.enableMouseOver();
        vnEngine.stage.onMouseMove= vnEngine.stageMouseMoveListener;
        Ticker.useRAF = true; 
        Ticker.setFPS(20);
        Ticker.addListener(vnEngine.stage,false);
        //start loading resource
        vnEngine.resourceManager = new ResourceManager(vnEngine.stage);
        vnEngine.resourceManager.init();
      }); 
  }

  this.initGameEnvirontment = function(){
    this.stateManager.ScreenStatus="game";
    this.graphicsManager.createDialogBox(
    function(){
      vnEngine.checkScript();
    });
  }

  //Check if right mouse clicked 
  //Check if speak text still scrolling
  //Check noClick Flag
  this.checkNextScript = function(ev){
      if (ev.nativeEvent.which == 3 || ev.nativeEvent.button == 2 ){
        if(vnEngine.stateManager.getScreenStatus() == "rightClickMenu"){
          vnEngine.stateManager.noCheckScriptFlag = vnEngine.stateManager.tempState;
          vnEngine.stage.removeChildAt(vnEngine.stage.getNumChildren()-1);
          if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable == false){
          vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable = true;
          }
          vnEngine.stateManager.setScreenStatus("game");
        }
        else if(vnEngine.stateManager.getScreenStatus() == "game"){
          vnEngine.stateManager.tempState = vnEngine.stateManager.noCheckScriptFlag;
          vnEngine.stateManager.noCheckScriptFlag=true;
          vnEngine.stateManager.setScreenStatus("rightClickMenu");
          vnEngine.initRightClickMenu();
       }
      }
      else if (vnEngine.stateManager.noCheckScriptFlag == false){
        if(vnEngine.stateManager.speakTextDisplayObject){
          if(vnEngine.stage.getChildAt(vnEngine.stage.getChildIndex(vnEngine.stateManager.speakTextDisplayObject)-1).canScroll){
            vnEngine.stage.getChildAt(vnEngine.stage.getChildIndex(vnEngine.stateManager.speakTextDisplayObject)-1).canScroll =false;
          }
          else{
            vnEngine.checkScript();
          }
        }
        else{
          vnEngine.checkScript();
        }
      }
    }

  //Run next script
  //run temporary script if defined
  this.checkScript = function(scriptArray){
     if(scriptArray != undefined){
      this.stateManager.tempScriptQueue.splice(0,this.stateManager.tempScriptQueue.length);
        if(scriptArray.length == undefined){
           this.stateManager.tempScriptQueue.push(scriptArray);
        }
        else{
          for(var i = 0 ; i <scriptArray.length;i++){
            this.stateManager.tempScriptQueue.push(scriptArray[i]);
            }
        }
        this.stateManager.tempScriptCounter = 0;
     }

     if(this.stateManager.tempScriptCounter < this.stateManager.tempScriptQueue.length){
      this.stateManager.tempScriptCounter++;
      this.parseScript(this.stateManager.tempScriptQueue,this.stateManager.tempScriptCounter);
     }
     else if(this.stateManager.scriptCounter<script.length){
      this.stateManager.scriptCounter++;
      this.parseScript(script,this.stateManager.scriptCounter);
    }
  }


  //Parse Script , Run the specified function
  this.parseScript = function(script,scriptCounter){
    if(scriptCounter-1<script.length){
     //console.log(scriptCounter-1 + " " + script[scriptCounter-1].type );
      switch(script[scriptCounter-1].type){
      case 'initMenu' :
        vnEngine.initMenu();
      break;
      case 'startGame' :
        vnEngine.initGameEnvirontment();
        break;
      case 'menu':
        vnEngine.initMenu();
        break;
      case 'speak' :
        this.speak(script[scriptCounter-1].character,script[scriptCounter-1].speak);
        break;
      case 'changeBackground':
        if(typeof(script[scriptCounter-1].nonParalaxable)!=undefined){
            this.graphicsManager.changeBackground(script[scriptCounter-1].imageLabel,undefined,
              script[scriptCounter-1].nonParalaxable);
          }
          else{
            this.graphicsManager.changeBackground(script[scriptCounter-1].imageLabel);
          }
        vnEngine.checkScript();
        break;
      case 'delay' :
        this.scriptDelay(script[scriptCounter-1].ms);
        break;
      case 'showCharacter':
        this.graphicsManager.showCharacter(script[scriptCounter-1].imageLabel,script[scriptCounter-1].position);
        vnEngine.checkScript();
        break;
      case 'hideCharacter':
        this.graphicsManager.hideCharacter(script[scriptCounter-1].position);
        vnEngine.checkScript();
      break;
      case 'pauseScript':
      break;
      case 'jumpTo' :
        this.scriptJump(script[scriptCounter-1].jumpLabel);
      break;
      case 'if':
       this.scriptIf(script[scriptCounter-1]);
      break;
      case 'addFlag' :
      case 'addJumpLabel':
        this.checkScript();
      break;
      case 'editFlag':
        this.stateManager.editFlag(script[scriptCounter-1].flagLabel ,script[scriptCounter-1].flagValue);
      break;
      case 'playBGM':
        this.stateManager.bgm = script[scriptCounter-1].soundLabel;
        this.soundController.playBGM(script[scriptCounter-1].soundLabel);
        vnEngine.checkScript();
      break;
      case 'stopBGM' :
        this.soundController.stopBGM();
      break;
      case 'option':
        this.scriptOption(script[scriptCounter-1].optionList);
      break;
      case 'showSettingsMenu' :
        this.initSettingsMenu();
      break;
      case 'playVideo':
        this.playVideo(script[scriptCounter-1].videoLabel);
      break;
      case 'hideGameDialog' :
        this.hideGameDialog();
      break;
      case 'showGameDialog' :
        this.showGameDialog();
      break;
      default:
       alert("script error");
       break;
    }
  }
}

  this.showGameDialog = function(){
    vnEngine.stateManager.dialogBox.visible = true;
    vnEngine.stateManager.speakTextDisplayObject.visible = true;
    vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).visible = true;

  }

  this.hideGameDialog = function(){
    vnEngine.stateManager.dialogBox.visible = false;
    vnEngine.stateManager.speakTextDisplayObject.visible = false;
    vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).visible = false;
  }

  this.initSaveLoadMenu = function(type,isInMainMenu){  
    var container = new Container();
    container.clickable =true;
    var res = vnEngine.resourceManager.getResource("save").img;

    var bitmap = new Bitmap(res);
    bitmap.scaleY =  this.canvas.height / res.height;
    bitmap.scaleX = this.canvas.width /  res.width;
    bitmap.x =0;
    bitmap.y = 0;


    var bgLayer = new Graphics();
    bgLayer.beginFill(Graphics.getRGB(0,0,0,0.5));

    var bgLayerXY = vnEngine.canvas.height/20;
    var bgLayerW = vnEngine.canvas.width- vnEngine.canvas.height/10;
    var bgLayerH = vnEngine.canvas.height/10*9;
    
    bgLayer.drawRect(bgLayerXY,bgLayerXY, 
    bgLayerW , bgLayerH);
    var bgLayerShape = new Shape(bgLayer);

    var saveLoadButtonContainer = new Container();
    saveLoadButtonContainer.clickable =true;

    var x = bgLayerXY +bgLayerW/10 ;
    var y = bgLayerXY + bgLayerH/7;
    var state = vnEngine.stateManager.getSaveStateInfo();


    (function(self,type) {
    self.saveLoadButtonClickListener= function(e){
      if(type == "save"){
        var state = vnEngine.stateManager.saveState(e.target.no);
        if(state.SNA.length >20){
          var speak = state.SCH +' :'+state.SNA.substring(0,20) + '...';
        }
        else{
          var speak = state.SCH +' :'+state.SNA;
        }
        e.target.setText(state.TIME + ' '+speak);
        alert("success");
      }
      else{
        //Remove Container
        if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable == false){
          vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable = true;
        }
        vnEngine.stage.removeChild(container);

        //load State
        if(e.target.state){
          if(e.target.isInMainMenu){
            if(e.target.isInMainMenu.target.parent.parent.isContainer == "true"){
              vnEngine.stage.removeChild(e.target.isInMainMenu.target.parent.parent);
            }
            else{
             vnEngine.stage.removeChild(e.target.isInMainMenu.target.parent);
            }
            vnEngine.stateManager.loadState(e.target.state);
          }
          else{
            vnEngine.stateManager.loadState(e.target.state);
          }
        }
        else{
          alert("slot Empty");
        }
      }
    }
  })(this,type);

    //Create Button
    for(var i =1 ; i < 9;i++){
      if(state[i-1] == undefined){
        var saveLoadDataButton = new Button("No Data",x,y,bgLayerW *8/10,30  );
        saveLoadDataButton.setTextAlign("left");
        saveLoadDataButton.no = i-1;
        saveLoadDataButton.onClickListener = this.saveLoadButtonClickListener;
        saveLoadDataButton.isInMainMenu = isInMainMenu;
      }
      else{
        if(state[i-1].SNA.length >20){
          var speak = state[i-1].SCH +' : '+state[i-1].SNA.substring(0,20) + '...';
        }
        else{
          var speak = state[i-1].SCH +' : '+state[i-1].SNA;
        }
        var saveLoadDataButton = new Button(state[i-1].TIME + ' '+speak ,x,y,bgLayerW *8/10,30);
        saveLoadDataButton.setTextAlign("left");
        saveLoadDataButton.state = state[i-1];
        saveLoadDataButton.no = i-1;
        saveLoadDataButton.onClickListener = this.saveLoadButtonClickListener;
        saveLoadDataButton.isInMainMenu = isInMainMenu;

      }
      y+=32;
      saveLoadButtonContainer.addChild(saveLoadDataButton);
    }

  if(type == "save"){
    var textMenu = new Text("SAVE" ,"17px arial","#FFF");
    textMenu.y = bgLayerXY+ 30;
    textMenu.x = vnEngine.canvas.width/2 - textMenu.getMeasuredWidth()/2;
  }
  else{
    var textMenu = new Text("Load" ,"17px arial","#FFF");
    textMenu.y = bgLayerXY+ 30;
    textMenu.x = vnEngine.canvas.width/2 - textMenu.getMeasuredWidth()/2;
  }

  var backButton = new Button("back",bgLayerW-100,bgLayerH-30,100,30);
  backButton.onClickListener=function(e){
    if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable == false){
      vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable = true;
    }
    vnEngine.stateManager.setScreenStatus(vnEngine.stateManager.getOldScreenStatus());
    vnEngine.stage.removeChild(container);
  }

    container.addChild(bitmap);
    container.addChild(bgLayerShape);
    container.addChild(textMenu);
    container.addChild(saveLoadButtonContainer);
    container.addChild(backButton);
    vnEngine.stage.addChild(container);
  }

  this.initMenu = function(){
    //Clear all game resource
    vnEngine.stage.removeAllChildren();
    vnEngine.stateManager.clearAllState();

    vnEngine.stateManager.setScreenStatus("MAIN_MENU");
    var res = vnEngine.resourceManager.getResource("menu").img;
    var container = new Container();
    container.clickable = true;
    var bitmap = new Bitmap(res);

    bitmap.scaleY =  this.canvas.height / res.height;
    bitmap.scaleX = this.canvas.width /  res.width;
    bitmap.x =0;
    bitmap.y = 0;
    container.addChild(bitmap);
    vnEngine.soundController.playBGM("menuBGM");

    var y =this.canvas.height*3/5;

    var startGameButton = new Button("Start Game",0,y,this.canvas.width,30);
    startGameButton.onClickListener = function(e){
      if(e.target.parent.parent.isContainer == "true"){
        vnEngine.stage.removeChild(e.target.parent.parent);
      }
      else{
       vnEngine.stage.removeChild(e.target.parent);
      }
        vnEngine.stateManager.noCheckScriptFlag = false;
        vnEngine.checkScript([{type:'jumpTo', jumpLabel:'startGame'},{type:'startGame'}]);
    }

    var loadButton = new Button("Load",0, y+40, this.canvas.width,30);
    loadButton.onClickListener = function(e){
      container.clickable = false;
      vnEngine.initSaveLoadMenu("load",e);
    }
    var settingsButton = new Button("Settings",0, y+80, this.canvas.width,30);
    settingsButton.onClickListener = function(){
      container.clickable = false;
      vnEngine.checkScript({type:'showSettingsMenu'});
    }
    container.addChild(startGameButton);
    container.addChild(settingsButton);
    container.addChild(loadButton);
    this.stage.addChild(container);
  }

  this.initSettingsMenu = function(){
    var container = new Container();
    container.clickable =true;
    var res = vnEngine.resourceManager.getResource("settings").img;

    var bitmap = new Bitmap(res);
    bitmap.scaleY =  this.canvas.height / res.height;
    bitmap.scaleX = this.canvas.width /  res.width;
    bitmap.x =0;
    bitmap.y = 0;


    var bgLayer = new Graphics();
    bgLayer.beginFill(Graphics.getRGB(0,0,0,0.5));

    var bgLayerXY = vnEngine.canvas.height/20;
    var bgLayerW = vnEngine.canvas.width- vnEngine.canvas.height/10;
    var bgLayerH = vnEngine.canvas.height/10*9;
    
    bgLayer.drawRect(bgLayerXY,bgLayerXY, 
    bgLayerW , bgLayerH);
    var bgLayerShape = new Shape(bgLayer);


    var textMenu = new Text("MENU" ,"17px arial","#FFF");
    textMenu.y = bgLayerXY+ 30;
    textMenu.x = vnEngine.canvas.width/2 - textMenu.getMeasuredWidth()/2;


    var textBGMVolume = new Text("BGM Volume" , "17px arial", "#FFF");
    textBGMVolume.y = bgLayerXY+textMenu.y +30;
    textBGMVolume.x =bgLayerXY +bgLayerW/10 ;

    var bgmSlider = new Slider(textBGMVolume.x,textBGMVolume.y+10,bgLayerW *8/10,30);
    bgmSlider.setBarPosition(vnEngine.soundController.getBGMVolume());
    bgmSlider.onBarChanged = function(e){
      vnEngine.soundController.changeBGMVolume(e);
    }

    var textSFXVolume = new Text("SoundEffect Volume" , "17px arial", "#FFF");
    textSFXVolume.y =bgmSlider.positionY+50
    textSFXVolume.x =bgmSlider.positionX ;

    var sfxSlider = new Slider(textSFXVolume.x,textSFXVolume.y+10,bgLayerW *8/10,30 );
    sfxSlider.setBarPosition(vnEngine.soundController.getSFXVolume());
    sfxSlider.onBarChanged = function(e){
      vnEngine.soundController.changeSoundEffectVolume(e);
    }

    var backButton = new Button("back",bgLayerW-100,bgLayerH-30,100,30);
    backButton.onClickListener=function(e){
      if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable == false){
        vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-2).clickable = true;
      }

      vnEngine.stateManager.setScreenStatus(vnEngine.stateManager.getOldScreenStatus());
      vnEngine.stage.removeChild(container);
    }

    var revertToDefaultButton = new Button("Revert To Default",bgLayerW-250,bgLayerH-30,140,30);
    revertToDefaultButton.onClickListener = function(e){
       bgmSlider.setBarPosition(50);
       sfxSlider.setBarPosition(50);
    }

    container.addChild(bitmap);
    container.addChild(bgLayerShape);
    container.addChild(textMenu);
    container.addChild(textBGMVolume);
    container.addChild(bgmSlider);
    container.addChild(textSFXVolume);
    container.addChild(sfxSlider);
    container.addChild(revertToDefaultButton);
    container.addChild(backButton);
    vnEngine.stage.addChild(container);
  }

  this.initRightClickMenu = function(){
    if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable){
      vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable = false;
    }
    var container = new Container();
    container.clickable = true;
    var background = new Graphics();
    background.beginFill(Graphics.getRGB(0,0,0,0.4));

    var x = this.canvas.width *4/5;
    var y = 0;
    var w = 1/5*this.canvas.width;
    var h = vnEngine.canvas.height - (2/4 * vnEngine.canvas.height) 
    background.drawRect(x,y,w,h);
    var bgShape = new Shape(background);

    var offset = h/8;
    var saveButton = new Button("Save",x,y+(h/4)-offset,w,30);
    saveButton.onClickListener = function(){
      container.clickable = false;
      vnEngine.stateManager.setScreenStatus("menu");
      vnEngine.initSaveLoadMenu("save");
    }

    var loadButton = new Button("Load",x,y+(h/2)-offset,w,30);
    loadButton.onClickListener = function(){
      container.clickable = false;
      vnEngine.stateManager.setScreenStatus("menu");
      vnEngine.initSaveLoadMenu("load");
    }

    var settingsButton = new Button("Settings",x,y+(h/4*3)-offset,w,30);
    settingsButton.onClickListener = function(){
      container.clickable = false;
      vnEngine.stateManager.setScreenStatus("menu");
      vnEngine.checkScript({type:'showSettingsMenu'});
    }
    var returnToTitleButton = new Button("Return to title",x,y+h-offset,w,30);
    returnToTitleButton.onClickListener = function(){
      vnEngine.soundController.stopBGM();
      vnEngine.checkScript({type:'initMenu'});
    }
    container.addChild(bgShape);
    container.addChild(saveButton);
    container.addChild(loadButton);
    container.addChild(settingsButton);
    container.addChild(returnToTitleButton);

    this.stage.addChild(container);

  }

  this.scriptJump = function(jumpLabel){
    var index = arrayIndexOf(this.stateManager.jumpLabelList,"jumpLabel",jumpLabel);
      if(index != -1){
        this.stateManager.scriptCounter = this.stateManager.jumpLabelList[index].scriptCounter;
        this.checkScript();
      }
      else{
        alert("Script Error");
      }
  }

  this.scriptIf = function(script){
    var exp1 = script.exp1;
    var exp2 = script.exp2;

    if(exp1.type == 'getFlag'){
      exp1 = this.stateManager.getFlag(exp1.flagLabel);
    }
      
    if(exp2.type == 'getFlag'){
       exp2 = this.stateManager.getFlag(exp2.flagLabel);
    }

    var op = script.op;
    var toBeEvaluated = "("+exp1+ op + exp2 +")? true: false;";
    var result = eval(toBeEvaluated); 

    if(result == true){
      this.checkScript(script.right);
    }
    else{
      this.checkScript(script.wrong);
    }
  }

  this.scriptOption = function(optionList){
    var heightGanjil = (this.canvas.height - (1/4 * this.canvas.height))*(2/4)+40;
    var heightGenap = (this.canvas.height - (1/4 * this.canvas.height))*(2/4);
    var container = new Container();
    container.clickable = true;
    container.isOption = true;
    var data;

    var onClickListenerFunction = function(e){
      if(e.target.parent.clickable){
        vnEngine.stateManager.chooseOptionNumber=e.target.no;
        vnEngine.stateManager.noCheckScriptFlag = false;
        vnEngine.checkScript(e.target.data.perform);
        vnEngine.stage.removeChild(e.target.parent);
      }
    }

    for (var i = 0;i<optionList.length;i++){
      if(i%2 == 0){
        var button  = new Button(optionList[i].caption,0,heightGenap,this.canvas.width,30);
        button.data = {perform : optionList[i].perform};
        button.no = i;
        button.onClickListener = onClickListenerFunction;
        container.addChild(button);
        heightGenap-=40;;  
      }
      else{
        var button  = new Button(optionList[i].caption,0,heightGanjil,this.canvas.width,30);
        button.data = {perform : optionList[i].perform};
        button.no = i;
        button.onClickListener = onClickListenerFunction;
        container.addChild(button);
        heightGanjil+=40;
      }
    }
  this.stage.addChild(container);
  this.stateManager.noCheckScriptFlag = true;
  }

  this.scriptDelay = function(ms){
    setTimeout("vnEngine.checkScript()",ms);
  }

  this.speak = function (character , speak){
    self = this;
    if(this.stateManager.speakTextDisplayObject == undefined){
      var txt = new Text("","17px arial","#FFF");
      txt.x = 30;
      txt.y = this.canvas.height-this.canvas.height/8;
      txt.lineWidth = this.canvas.width;
      txt.textAlign ="left";
      this.stage.addChild(txt);

      var chara = new Text("","17px arial","#FFF");
      chara.x = 30;
      chara.y = this.canvas.height-this.canvas.height/5;
      this.stage.addChild(chara);
      this.stateManager.speakTextDisplayObject = chara;
    }

      vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text ="";
      vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).canScroll = true;
      setTimeout(function(){
        self.startTextScrolling(character,speak);
      },50);

    this.startTextScrolling = function(character,speak){
      vnEngine.stateManager.speakTextDisplayObject.text=character;
      var tempText = vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text;

      if(vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).canScroll){
        if(speak.length > 3 ){
          var cutted = speak.substr(0,3);
          speak = speak.substr(3,speak.length);
          vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text =tempText+cutted;
        }
        else{
          vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text = tempText+speak;
          speak = ""; 
          vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).canScroll = false; 
        }
          if(speak.length >0){
            setTimeout(function(){
              self.startTextScrolling(character,speak);
            },50);
          }
        }
        else{
         vnEngine.stateManager.speakTextDisplayObject.text=character;
         vnEngine.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text =tempText+speak;
        }
      }
    }

    this.playVideo = function(label){
      var video = vnEngine.resourceManager.getResource(label);
      var bitmap = new Bitmap(video.vid);
      bitmap.scaleX =  vnEngine.canvas.width / video.vid.videoWidth;
      bitmap.scaleY = vnEngine.canvas.height /video.vid.videoHeight;
      vnEngine.stage.addChild(bitmap);
      video.vid.addEventListener('ended',function(){
        vnEngine.stage.removeChild(bitmap);
        vnEngine.checkScript();
        });
      video.vid.play();
    }

    this.stageMouseMoveListener = function(e){
      //console.log(e); 
      vnEngine.stateManager.paralaxableObject.moveObject(e.stageX,e.stageY);
    }
}

function arrayIndexOf(array, obj,value) {
        for (var i = 0; i < array.length; i++) {
          if (array[i][obj] == value) {
              return i;
          }
      }
      return -1;
  }

function Button(text,x,y,width,height){
  var self = this;
  this.align = "center";
  var container = new Container();
  container.onClickListener = undefined;
  var optionRect = new Graphics();
  optionRect.beginFill(Graphics.getRGB(0,0,0,0.5));
  optionRect.drawRect(x,y,width ,height);

  var shape = new Shape(optionRect);

  shape.rectX = x;
  shape.rectY = y;
  shape.rectW = width;
  shape.rectH = height;


  container.addChild(shape);

  var txt = new Text(text,"17px arial","#FFF");
  txt.x = width/2 - txt.getMeasuredWidth()/2+x;
  txt.y = y+20;
  container.addChild(txt);

  container.setText = function(text){
    txt.text = text;
    container.setTextAlign(self.align);
  }

  container.setTextAlign=function(align){
    self.align = align;
    switch(align){
      case 'left':
        txt.x = x+10;
      break;
      case 'center':
        txt.x = width/2 - txt.getMeasuredWidth()/2+x;
      break
      case 'right':
        txt.x = width - txt.getMeasuredWidth -10;
      break;
    }
  }

  container.onMouseOver = function(e){
    if(e.target.parent.clickable || e.target.clickable){
      var obj = e.target.children[0];
      vnEngine.soundController.playEffect("sfxClick");
      obj.graphics.clear();
      obj.graphics.beginFill(Graphics.getRGB(255,255,255,0.5));
      obj.graphics.drawRect(obj.rectX,obj.rectY,obj.rectW,obj.rectH);
    }
  }

  container.onMouseOut =function(e){
    if(e.target.parent.clickable || e.target.clickable){
      var obj = e.target.children[0];
      obj.graphics.clear();
      obj.graphics.beginFill(Graphics.getRGB(0,0,0,0.5));
      obj.graphics.drawRect(obj.rectX,obj.rectY,obj.rectW,obj.rectH);
    }
  }
  container.onClick =function(e){
  if((e.target.parent.clickable || e.target.clickable)&&!(e.nativeEvent.which == 3 || e.nativeEvent.button == 2 )){
      container.onMouseOut(e);
      if(container.onClickListener!=undefined )
      {
        container.onClickListener(e);
      }
    }
  }
  return container;
}

function GraphicsManager(){
  this.changeBackground = function(imageLabel,callback,options){
    console.log(options);

    //OPTIONS
    var BACKGROUND_PARALAX = 0.1;
    //OPTIONS
    var paralaxModifier =0;

    if(typeof(options)!=undefined){
      if(options == true){
     }
     else{
      paralaxModifier = BACKGROUND_PARALAX;
     }
    }
    else{
      paralaxModifier = BACKGROUND_PARALAX;
    }

    var res;
    if(imageLabel.color == undefined){ //Check Background type if not solid color then get image resource
      res  = vnEngine.resourceManager.getResource(imageLabel);
      if(res == false){
        alert("script error \nChangeBackground : \nimageLabel : "+imageLabel+" not found \nscript line : "+vnEngine.scriptCounter);
      }
    }
    else res = false;
    
    vnEngine.stateManager.backgroundImage = imageLabel; 

    //if we use images as background
    if(res){
      res = res.img;
      var bitmap = new Bitmap(res);
      bitmap.scaleY =  (vnEngine.canvas.height / res.height) + paralaxModifier ;
      bitmap.scaleX = (vnEngine.canvas.width /  res.width) + paralaxModifier;
      bitmap.x = (vnEngine.canvas.height/2 - (bitmap.scaleY *res.height)/2) ;
      bitmap.y = (vnEngine.canvas.width/2 - (bitmap.scaleX *res.width)/2);
      bitmap.width =bitmap.scaleX *res.width;
      bitmap.height =bitmap.scaleY *res.height;
    }
    //If we use color as background
    else{ 
      var g = new Graphics();
      g.beginFill(imageLabel.color);
      g.drawRect(0,0,vnEngine.canvas.width,vnEngine.canvas.height);
      var bitmap = new Shape(g);
      bitmap.width =vnEngine.canvas.width;
      bitmap.height =vnEngine.canvas.height;
    }

    bitmap.isBackground = true;

    //set bitmap onclick to run next script if current status is game or menu
    if(vnEngine.stateManager.getScreenStatus() =="game" || vnEngine.stateManager.getScreenStatus() =="menu"){
      bitmap.onClick = vnEngine.checkNextScript;
    }

    //Set background to be exposed to paralax effect
    if(paralaxModifier > 0 && res != false){
      vnEngine.stateManager.paralaxableObject.addObject(bitmap);
    }else vnEngine.stateManager.paralaxableObject.removeObject(bitmap);

    //Check Background Position , for tweening background
    if(vnEngine.stage.getNumChildren() >0){
      if(vnEngine.stage.getChildAt(0).isBackground){
        vnEngine.stateManager.noCheckScriptFlag = true;
        var old = vnEngine.stage.getChildAt(0);
        vnEngine.stage.removeChildAt(0);
        vnEngine.stage.addChildAt(bitmap,0);
        vnEngine.stage.addChildAt(old,0);
        if(callback == undefined){ //callback undefined and child 0 is Background , Children >0
          Tween.get(bitmap).to({alpha:0}).to({alpha:1},300)
          .call(function(){
          vnEngine.stage.removeChildAt(0);vnEngine.stateManager.noCheckScriptFlag = false;});
        }
        else{ //callback defined and child 0 is Background , children >0
          Tween.get(bitmap).to({alpha:0}).to({alpha:1},300)
          .call(function() {
          vnEngine.stage.removeChildAt(0);callback();} );
        }

      }
      else{ //child 0 not background
      vnEngine.stage.addChildAt(bitmap,0);
      Tween.get(bitmap).to({alpha:0}).to({alpha:1},300);
      }
    }
    else{ //Children not exist
      vnEngine.stage.addChild(bitmap);
      if(callback == undefined){ //Children not exist , no callback
        Tween.get(bitmap).to({alpha:0}).to({alpha:1},300);
      }
      else{ //Children exist , no callback
         Tween.get(bitmap).to({alpha:0}).to({alpha:1},300)
          .call(function() {
          callback();} );
      }
    }
  } 

 this.showCharacter = function(chara , position){
    var res  = vnEngine.resourceManager.getResource(chara).img;
    var bitmap = new Bitmap(res);
    var scaledY = (vnEngine.canvas.height * (9/10))/res.height;

    bitmap.scaleY =  scaledY;
    bitmap.scaleX =  scaledY;
    bitmap.width = bitmap.scaleX * res.width;
    bitmap.height = bitmap.scaleY * res.height;
    bitmap.y = 1/10 * vnEngine.canvas.height;
    
    switch(position){
      case 'left' :
        bitmap.x = 1/4 * vnEngine.canvas.width *scaledY/2;
      break;
      case 'right':
        bitmap.x = vnEngine.canvas.width  *3/4 - res.width*scaledY/2;
      break;
      case 'center' :
        bitmap.x = vnEngine.canvas.width/2 - res.width*scaledY/2;
      break;
      default:
        alert("script Error \n Character position error \n");
      break;
  } 
  bitmap.centerX = bitmap.x;
  bitmap.centerY = bitmap.y; 
  vnEngine.stateManager.displayCharacterList[position] = chara;
  bitmap.position = position;

  bitmap.isCharacter = true;
  vnEngine.stateManager.paralaxableObject.addObject(bitmap);

  vnEngine.stage.addChildAt(bitmap,2); 
  Tween.get(bitmap).to({alpha:0}).wait(100).to({alpha:1},300);
  }

  this.hideCharacter=function(position){
    var chara,i;
    for(i = 0 ; i < vnEngine.stage.getNumChildren();i++){
      chara = vnEngine.stage.getChildAt(i);
      if(chara.isCharacter){
        if(chara.position == position) {
          break;
        }
      }
    }
      if (i == vnEngine.stage.getNumChildren()) {
        console.log("character not found");
      }
      else{
        vnEngine.stateManager.paralaxableObject.removeObject(vnEngine.stage.getChildAt(i));
        Tween.get(chara).to({alpha:0},100).call(vnEngine.stage.removeChild,
          [chara],vnEngine.stage);
          vnEngine.stateManager.displayCharacterList[position] = undefined;
      }
  }

  this.createDialogBox = function(run){
    var textRect = new Graphics();
    textRect.beginFill(Graphics.getRGB(0,0,0,0.5));
    textRect.drawRect(0,vnEngine.canvas.height - (1/4 * vnEngine.canvas.height) , vnEngine.canvas.width , 1/4 * vnEngine.canvas.height);

    var shape = new Shape(textRect);
    shape.onClick = vnEngine.checkNextScript;
    vnEngine.stage.addChild(shape);
    vnEngine.stateManager.dialogBox = shape;

    if(run!=undefined){
      run();
    }
  }
}

function Slider(x,y,width,height){
  var container = new Container();
  container.positionX = x;
  container.positionY = y;

  container.onBarChanged = undefined;
  //Create Background
  var bar = new Graphics();
  bar.beginStroke(Graphics.getRGB(240,255,244));
  bar.beginFill(Graphics.getRGB(240,255,244));
  bar.drawRect(x,y + height/2 - height/6,width,height/3); 
  var barShape = new Shape(bar);
  barShape.width = width;

  //create Slider
  var slide = new Graphics();
  slide.beginStroke(Graphics.getRGB(222,222,222));
  slide.beginFill(Graphics.getRGB(222,222,222));
  slide.drawRect(x,y,height/5,height);
  var slideShape = new Shape(slide);
  slideShape.width =height/5; 
  var offset=x;

  //Event Handler;
  (function(slide , bar, container) {
    var change;
    slide.onPress = function(evt) {
      evt.onMouseMove = function(ev) {
        if(ev.stageX  <= offset + barShape.width && ev.stageX >= offset){
          slideShape.x = ev.stageX - offset; 
          change =  slideShape.x / barShape.width *100;
          if(container.onBarChanged !=undefined){
           container.onBarChanged(change);
          }
        }  
      }
      }
    bar.onPress = function(evt){
      slideShape.x = evt.stageX - offset - slideShape.width/2;
      change =  slideShape.x / barShape.width *100;
        if(container.onBarChanged !=undefined){
         container.onBarChanged(change);
        }

     }
    container.setBarPosition = function(presentage){
      slideShape.x = presentage/100*barShape.width;
       if(container.onBarChanged !=undefined){
          container.onBarChanged(presentage);
        }

    }
  })(slideShape,barShape,container);

  container.addChild(barShape);
  container.addChild(slideShape);
  return container;
}