var script = new Array;
 
  script.push({type:'playBGM',soundLabel: 'menuBGM'});
  script.push({type:'changeBackground',imageLabel:'s1'});
  script.push({type:'delay',ms:3000});
  script.push({type:'changeBackground',imageLabel:'s2'});
  script.push({type:'delay',ms:'3000'});
  script.push({type:'initMenu'});

  script.push({type:'addJumpLabel', jumpLabel:'startGame'});
  script.push({type:'startGame'});
  script.push({type:'addFlag',flagLabel :'F1',flagValue:'false'});
  script.push({type:'addFlag',flagLabel :'F2',flagValue:'false'});
  script.push({type:'addJumpLabel', jumpLabel:'A1'});
  script.push({type:'if',
              op:'==',
              exp1 : {type:'getFlag',flagLabel:"F2"}, 
              exp2:'true',
              right : {type:'editFlag',flagLabel:"F1", flagValue:'true'},
              wrong :undefined});
  script.push({type:'changeBackground',imageLabel:'s1'});
  script.push({type:'playBGM',soundLabel: 'normal'});

  script.push({type:'speak' ,character :'Gilang', speak: 'kimochi  :)'});
  script.push({type:'showCharacter',imageLabel :'charaRina1' , position: 'left'});
  script.push({type:'pauseScript'});
  script.push({type:'playBGM',soundLabel: 'normal'});
  script.push({type:'showCharacter',imageLabel :'charaClara1', position: 'center'});
  script.push({type:'pauseScript'});
  script.push({type:'playBGM',soundLabel: 'normal'});
  script.push({type:'showCharacter',imageLabel :'charaLily1',position:'right'});
  script.push({type:'pauseScript'});

  script.push({type:'changeBackground',imageLabel:'s2'});
  script.push({type:'speak', character :'rina',speak : 'apaan pagi-pagi udah halo?'});
  script.push({type:'changeBackground',imageLabel:'s1'});
  script.push({type:'pauseScript'});
  script.push({type:'hideCharacter',position :'right'});
  script.push({type:'pauseScript'});
  script.push({type:'hideCharacter',position :'left'});
  script.push({type:'pauseScript'});
  script.push({type:'changeBackground',imageLabel:'s2'});
  script.push({type:'pauseScript'});
  script.push({type:'speak',character : 'gilang' , speak : 'Eh? semuanya pada kemana?'});
  script.push({type:'hideCharacter',position :'center'});

  script.push({type:'if',
            op:'==',
            exp1 : {type:'getFlag',flagLabel:"F1"}, 
            exp2:'true',
            right : undefined,
            wrong :[{type :'editFlag',flagLabel:'F2',flagValue:'true'},{type :'jumpTo',jumpLabel:'A1'}]});
  script.push({type:'option' , optionList : [
    {caption : 'Ulangi' , perform: {type : 'jumpTo' , jumpLabel:'A1'}},
    {caption :'Selesai' , perform: undefined}
  ]});
  script.push({type:'playBGM',soundLabel: 'ending'});
  script.push({type: 'speak', character:'Gilang',speak:'apa yang terjadi? gamenya selesai?'});


var resourceList = new Array;
  resourceList.push({type :'img',url  :'resource/image/1.jpg',imageLabel :'s1'});
  resourceList.push({type :'img',url  :'resource/image/2.jpg',imageLabel :'s2'});
  resourceList.push({type :'img',url  :'resource/image/chara/rina1.png',imageLabel :'charaRina1'});
  resourceList.push({type :'img',url  :'resource/image/chara/clara1.png',imageLabel :'charaClara1'});
  resourceList.push({type :'img',url  :'resource/image/chara/lily1.png',imageLabel :'charaLily1'});
  resourceList.push({type :'snd',url  :'resource/sound/ending.mp3', soundLabel : 'ending'});
  resourceList.push({type :'snd',url  : 'resource/sound/opening.mp3',soundLabel : 'menuBGM'});
  resourceList.push({type :'snd',url  :'resource/sound/sad.mp3',soundLabel : 'sad'});
  resourceList.push({type :'snd',url  : 'resource/sound/normal.mp3',soundLabel : 'normal'});
  resourceList.push({type :'snd',url  : 'resource/sfx/click.wav',soundLabel : 'sfxClick'});
  resourceList.push({type :'img',url  :'resource/image/3.jpg' , imageLabel:'menu'});
  resourceList.push({type :'img',url  :'resource/image/4.jpg' , imageLabel:'settings'});

function vnEngine(){
  var self = this;
  
  this.canvas;
  this.stage;
  this.context;

  this.resourceManager;
  this.soundController;
  this.graphicsManager;
  this.stateManager;

  this.initGame = function(canvasId){
    //Bind canvas to easel JS
    this.canvas = document.getElementById(canvasId);
    document.getElementById(canvasId).oncontextmenu=new Function ("return false");
    this.context = this.canvas.getContext("2d");

    //setup sound Controller ,GraphicsManager and stateManager
    this.graphicsManager = new GraphicsManager();
    this.soundController = new SoundController(); 
    this.stateManager = new StateManager();

    //Check Script for any jump & flag
    //Put every jump label into array 
    this.stateManager.initScript();

    //create & configure easel js canvas  
    this.stage = new Stage(this.canvas);
    this.stage.enableMouseOver()
    Ticker.setFPS(20);
    Ticker.addListener(this.stage,false);


    //start loading resource
    this.resourceManager = new ResourceManager(this.stage);
    this.resourceManager.init();
  }



  this.initGameEnvirontment = function(){
    this.stateManager.ScreenStatus =2;
    this.graphicsManager.createDialogBox();
  }


  //Nantinya fungsi ini akan mengatur cepat jalanya script + 
  //Memunculkan menu ketika klik kanan
  this.checkNextScript = function(ev){
      if (ev.nativeEvent.which == 3 ||ev.nativeEvent.button == 2 ){
        if(vnEngine.stateManager.ScreenStatus == 3){
          vnEngine.stateManager.noCheckScriptFlag = vnEngine.stateManager.tempState;
          vnEngine.stage.removeChildAt(vnEngine.stage.getNumChildren()-1);

          if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable == false){
          vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable = true;
          }

          vnEngine.stateManager.ScreenStatus=2;
        }
        else{
        vnEngine.stateManager.tempState = vnEngine.stateManager.noCheckScriptFlag;
        vnEngine.stateManager.noCheckScriptFlag=true;
        vnEngine.stateManager.ScreenStatus = 3;
        vnEngine.initRightClickMenu();
      }
      }
      else if (vnEngine.stateManager.noCheckScriptFlag == false){
        vnEngine.checkScript();
      }
    }

  //Menjalankan Script selanjutnya
  //bertugas memilah & menjalankan perintah dari script
  this.checkScript = function(scriptArray){
     if(scriptArray != undefined){
      this.tempScriptQueue.splice(0,this.tempScriptQueue.length);
        if(scriptArray.length == undefined){
           this.tempScriptQueue.push(scriptArray);
        }
        else{
          for(var i = 0 ; i <scriptArray.length;i++){
            this.tempScriptQueue.push(scriptArray[i]);
            }
        }
        this.tempScriptCounter = 0;
     }

     if(this.tempScriptCounter < this.tempScriptQueue.length){
      this.tempScriptCounter++;
      this.parseScript(this.tempScriptQueue,this.tempScriptCounter);
     }
     else{
      this.scriptCounter++;
      this.parseScript(script,this.scriptCounter);
    }
  }


  //Menjalankan Script selanjutnya
  //bertugas memilah & menjalankan perintah dari script
  this.parseScript = function(script,scriptCounter){
    if(scriptCounter-1<script.length){
     console.log(scriptCounter-1 + " " + script[scriptCounter-1].type);
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
        this.graphicsManager.changeBackground(script[scriptCounter-1].imageLabel);
        break;
      case 'delay' :
        this.scriptDelay(script[scriptCounter-1].ms);
        break;
      case 'showCharacter' :
        this.graphicsManager.showCharacter(script[scriptCounter-1].imageLabel,script[scriptCounter-1].position);
        break;
      case 'hideCharacter':
        this.graphicsManager.hideCharacter(script[scriptCounter-1].position);
      break;
      case 'pauseScript':
      break;
      case 'jumpTo' :
        var index = arrayIndexOf(this.jumpLabelList,"jumpLabel",script[scriptCounter-1].jumpLabel);
        if(index != -1){
          this.scriptCounter = this.jumpLabelList[index].scriptCounter;
          this.checkScript();
        }
        else{
          alert("Script Error");
        }
      break;
      case 'if':
       this.scriptIf(script[scriptCounter-1]);
      break;
      case 'addFlag' :
      case 'addJumpLabel':
        this.checkScript();
      break;
      case 'editFlag':
        this.editFlag(script[scriptCounter-1].flagLabel ,script[scriptCounter-1].flagValue);
      break;
      case 'playBGM':
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
      default:
       alert("script error");
       break;
    }
  }
}
  this.initMenu = function(){
    //Clear all game resource
    vnEngine.stage.removeAllChildren();
    vnEngine.stateManager.clearAllState();

    vnEngine.stateManager.ScreenStatus = 1;
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
        vnEngine.checkScript({type:'jumpTo', jumpLabel:'startGame'});
    }

    var loadButton = new Button("Load",0, y+40, this.canvas.width,30);
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

    var saveButton = new Button("Save",x,y+60,w,30);
    var loadButton = new Button("Load",x,y+100,w,30);
    var settingsButton = new Button("Settings",x,y+140,w,30);
    settingsButton.onClickListener = function(){
      container.clickable = false;
      vnEngine.checkScript({type:'showSettingsMenu'});
    }
    var returnToTitleButton = new Button("Return to title",x,y+180,w,30);
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
  this.scriptIf = function(script){
    var exp1 = script.exp1;
    var exp2 = script.exp2;

    if(exp1.type == 'getFlag'){
      exp1 = this.getFlag(exp1.flagLabel);
    }
      
    if(exp2.type == 'getFlag'){
       exp2 = this.getFlag(exp2.flagLabel);
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
    var data;

    var onClickListenerFunction = function(e){
      if(e.target.parent.clickable){
      vnEngine.stateManager.noCheckScriptFlag = false;
      vnEngine.checkScript(e.target.data.perform);
      vnEngine.stage.removeChild(e.target.parent);
      }
    }

    for (var i = 0;i<optionList.length;i++){
      if(i%2 == 0){
        var button  = new Button(optionList[i].caption,0,heightGenap,this.canvas.width,30);
        button.data = {perform : optionList[i].perform};
        button.onClickListener = onClickListenerFunction;
        container.addChild(button);
        heightGenap-=40;;  
      }
      else{
        var button  = new Button(optionList[i].caption,0,heightGanjil,this.canvas.width,30);
        button.data = {perform : optionList[i].perform};
        button.onClickListener = onClickListenerFunction;
        container.addChild(button);
        heightGanjil+=40;
      }
    }
  this.stage.addChild(container);
  this.stateManager.noCheckScriptFlag = true;
  }

  this.editFlag = function (flagLabel , flagValue){
    var index  = arrayIndexOf(this.flagList,"flagLabel",flagLabel);
    if(index != -1){
        this.flagList[index].flagValue = flagValue;
      }
      else{
        alert("script error");
      }
      this.checkScript();
  }

  this.getFlag = function (flagLabel){
    var index  = arrayIndexOf(this.flagList,"flagLabel",flagLabel);
    if(index != -1){
        return this.flagList[index].flagValue;
      }
      else{
        alert("script error");
      }
  }

  this.scriptDelay = function(ms){
    setTimeout("vnEngine.checkScript()",ms);
  }

  this.speak = function (character , speak){
    if(this.stateManager.speakTextDisplayObject == undefined){
      var txt = new Text(speak,"17px arial","#FFF");
      txt.x = 30;
      txt.y = this.canvas.height-this.canvas.height/8;
      this.stage.addChild(txt);
      var chara = new Text(character,"17px arial","#FFF");
      chara.x = 30;
      chara.y = this.canvas.height-this.canvas.height/5;
      this.stage.addChild(chara);
      this.stateManager.speakTextDisplayObject = chara;
    }
    else{
      this.stateManager.speakTextDisplayObject.text =character;
      this.stage.getChildAt(this.stage.getChildIndex(this.stateManager.speakTextDisplayObject)-1).text = speak;
    }
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
  if(e.target.parent.clickable || e.target.clickable){
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
  this.changeBackground = function(imageLabel){
    var res  = vnEngine.resourceManager.getResource(imageLabel).img;
    var bitmap = new Bitmap(res);
    bitmap.scaleY =  vnEngine.canvas.height / res.height;
    bitmap.scaleX = vnEngine.canvas.width /  res.width;
    bitmap.x =0;
    bitmap.y = 0;
    bitmap.isBackground = true;
    if(vnEngine.stateManager.ScreenStatus ==2){
      bitmap.onClick = vnEngine.checkNextScript;
    }

    if(vnEngine.stage.getNumChildren() >0){
      if(vnEngine.stage.getChildAt(0).isBackground){
        vnEngine.stateManager.noCheckScriptFlag = true;
        var old = vnEngine.stage.getChildAt(0);
        vnEngine.stage.removeChildAt(0);
        vnEngine.stage.addChildAt(bitmap,0);
        vnEngine.stage.addChildAt(old,0);
        Tween.get(bitmap).to({alpha:0}).to({alpha:1},300)
        .call(function(){
        vnEngine.stage.removeChildAt(0);vnEngine.stateManager.noCheckScriptFlag = false;});
      }
      else{
      vnEngine.stage.addChildAt(bitmap,0);
      Tween.get(bitmap).to({alpha:0}).to({alpha:1},300);
      }
    }
    else{
      vnEngine.stage.addChild(bitmap);
      Tween.get(bitmap).to({alpha:0}).to({alpha:1},300);
    }
    vnEngine.checkScript();
  } 

 this.showCharacter = function(chara , position){
    var res  = vnEngine.resourceManager.getResource(chara).img;
    var bitmap = new Bitmap(res);
    var scaledY = vnEngine.canvas.height * (9/10);

    var Yscaling = scaledY/res.height; 

    bitmap.scaleY =  Yscaling;
    bitmap.scaleX =  Yscaling;
    bitmap.y = 1/10 * vnEngine.canvas.height;
    
    switch(position){
      case 'left' :
        bitmap.x = 1/3 * vnEngine.canvas.width *Yscaling/2;
      break;
      case 'right':
        bitmap.x = vnEngine.canvas.width  *3/4 - res.width*Yscaling /2;
      break;
      case 'center' :
        bitmap.x = vnEngine.canvas.width/2 - res.width*Yscaling /2;
      break;
      default:
        alert("script Error");
      break;
  } 
  bitmap.position = position;   
  vnEngine.stage.addChildAt(bitmap,1); 
  Tween.get(bitmap).to({alpha:0}).wait(100).to({alpha:1},300);
  vnEngine.checkScript();
  }

  this.hideCharacter=function(position){
    var chara,i;
    for(i = 0 ; i < vnEngine.stage.getNumChildren();i++){
      chara = vnEngine.stage.getChildAt(i);
      if(chara.position != undefined ){
        if(chara.position == position) {
          break;
        }
      }
    }
      if (i+1 == vnEngine.stage.getNumChildren) {
        alert("script error");
      }
      else{
        Tween.get(chara).to({alpha:0},100).call(vnEngine.stage.removeChild,
          [chara],vnEngine.stage);
          vnEngine.checkScript();
      }
  }

  this.createDialogBox = function(){
    var textRect = new Graphics();
    textRect.beginFill(Graphics.getRGB(0,0,0,0.5));
    textRect.drawRect(0,vnEngine.canvas.height - (1/4 * vnEngine.canvas.height) , vnEngine.canvas.width , 1/4 * vnEngine.canvas.height);

    var shape = new Shape(textRect);
    shape.onClick = vnEngine.checkNextScript;
    vnEngine.stage.addChild(shape);
    vnEngine.checkScript();
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






