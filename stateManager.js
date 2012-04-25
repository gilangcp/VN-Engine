function StateManager(){
  self =this;
  this.speakTextDisplayObject = undefined;
	this.ScreenStatus = 0;
	this.noCheckScriptFlag =false;
	this.tempState = undefined;
  this.tempScreenStatus = undefined;
  this.scriptCounter = 0;
  this.tempScriptQueue = new Array;
  this.tempScriptCounter =0;
  this.dialogBox = undefined;

  this.displayCharacterList = {left: undefined , right: undefined , center: undefined};
  this.backgroundImage = undefined;
  this.bgm = undefined;

  this.jumpLabelList = new Array;
	this.flagList = new Array;
	this.defaultflagList = new Array;
  this.paralaxableObject = new ParalaxableObject();

	this.clearAllState = function(){
    this.dialogBox = undefined;
    this.currentImage = undefined;
    this.tempScreenStatus = undefined;
		this.speakTextDisplayObject = undefined;
		this.ScreenStatus = 0;
		this.noCheckScriptFlag =false;
		this.tempState = undefined;
  	this.scriptCounter = 0;
  	this.tempScriptQueue = new Array;
  	this.tempScriptCounter =0;
  	this.flagList = this.defaultflagList;

    this.displayCharacterList = {left: undefined , right: undefined , center: undefined};
    this.backgroundImage = undefined;
    this.bgm = undefined;

    this.paralaxableObject.clean();
	}

  //Look for any Flag / Jump label
  //then put it on JumpLabelList
  this.initScript =function(){
    for(var i = 0; i<script.length;i++){
      switch (script[i].type){
      case 'addJumpLabel': 
        this.jumpLabelList.push({jumpLabel:script[i].jumpLabel , scriptCounter : i+1 });
      break;
      case 'addFlag':
        this.flagList.push({flagLabel: script[i].flagLabel,flagValue :script[i].flagValue});
      break;
      }
    }
       	this.defaultflagList = this.flagList;
  }

  //Script for Editing Flag
  this.editFlag = function (flagLabel , flagValue){
    var index  = arrayIndexOf(this.flagList,"flagLabel",flagLabel);
    if(index != -1){
        this.flagList[index].flagValue = flagValue;
      }
      else{
        alert("script error");
      }
      vnEngine.checkScript();
  }

  //script for adding flag
  this.getFlag = function (flagLabel){
    var index  = arrayIndexOf(this.flagList,"flagLabel",flagLabel);
    if(index != -1){
        return this.flagList[index].flagValue;
      }
      else{
        alert("script error");
      }
  }

  this.getOldScreenStatus = function(){
    return this.tempScreenStatus;
  }

  this.getScreenStatus = function(){
    return this.ScreenStatus;
  }

  this.setScreenStatus = function(state){
    this.tempScreenStatus = this.ScreenStatus;
    this.ScreenStatus = state;
  }

  this.saveState = function(no){
  var state = JSON.parse(localStorage.getItem("state"));

  if(state == undefined){
    state = new Array;
  }

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy;
  if (minutes < 10)
  minutes = "0" + minutes;
  var time = today +' '+ hours + ":" + minutes;
  	state[no] = {
      NO   :no,
      TIME :time,
  		SC   :self.scriptCounter,
  		JLL  :self.jumpLabelList,
  		FL   :self.flagList,
  		DFL  :self.defaultflagList,
  		BGM	 :self.bgm,
  		CHR	 :self.displayCharacterList,
  		BGI  :self.backgroundImage,
      SCH  :self.speakTextDisplayObject.text,
      SNA  :vnEngine.stage.getChildAt(vnEngine.stage.getChildIndex(self.speakTextDisplayObject)-1).text
  	};
  	localStorage.setItem("state",JSON.stringify(state));
    return state[no];
  	console.log("state Saved");
  }

  this.getSaveStateInfo = function(){
    var data =JSON.parse(localStorage.getItem("state"));
      if(data!=null)
        return JSON.parse(localStorage.getItem("state"));
      else return new Array;
  }

  this.loadState = function(state){
    this.jumpLabelList = state.JLL;
    this.flagList = state.FL;
    this.defaultflagList = state.DFL;

    vnEngine.soundController.playBGM(state.BGM);

    self.setScreenStatus("game");
    vnEngine.graphicsManager.changeBackground(state.BGI, function(){
      if(self.getOldScreenStatus() == "MAIN_MENU"){
          vnEngine.graphicsManager.createDialogBox();
          self.speakTextDisplayObject = undefined;
          vnEngine.speak(state.SCH,state.SNA);
      }
      else{
        vnEngine.speak(state.SCH,state.SNA);
        //Remove right click menu
        vnEngine.stateManager.noCheckScriptFlag = vnEngine.stateManager.tempState;
        vnEngine.stage.removeChildAt(vnEngine.stage.getNumChildren()-1);
        if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable == false){
          vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable = true;
        }
      }

      if(state.CHR.left!= undefined){
        vnEngine.graphicsManager.hideCharacter("left");
        vnEngine.graphicsManager.showCharacter(state.CHR.left,"left");
      }else{
        vnEngine.graphicsManager.hideCharacter("left");
      }

      if(state.CHR.right!= undefined){
        vnEngine.graphicsManager.hideCharacter("right");
        vnEngine.graphicsManager.showCharacter(state.CHR.right,"right");
      }else{
        vnEngine.graphicsManager.hideCharacter("right");
      }

      if(state.CHR.center != undefined){
        vnEngine.graphicsManager.hideCharacter("center");
        vnEngine.graphicsManager.showCharacter(state.CHR.center,"center");
      }else{
        vnEngine.graphicsManager.hideCharacter("center");
      }

      vnEngine.stateManager.scriptCounter = state.SC;
      
      if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).isOption ==true){
        vnEngine.stateManager.noCheckScriptFlag = false;
        vnEngine.stage.removeChildAt(vnEngine.stage.getNumChildren()-1);
      }

      //Option
      if(script[vnEngine.stateManager.scriptCounter-1].type == "option"){
        vnEngine.stateManager.scriptCounter--;
        vnEngine.checkScript();
      }
     console.log("state Loaded"); 
    });
  }
}


function ParalaxableObject (){
  this.array = new Array;
  this.addObject = function(bitmap){
      //Add or remove From Paralaxable Object
      var index = this.array.indexOf(bitmap); 
        if(index ==-1){ 
          this.array.push(bitmap);
        }
        else{
          this.array[index] = bitmap;
        }
  }

  this.removeObject = function(bitmap){
      //Add or remove From Paralaxable Object
      var index = this.array.indexOf(bitmap); 
        if(index !=-1){ 
          this.array.splice(index,1);
        }
  }

  this.clean = function(){
    this.array.splice(0,this.length);
  }

  this.moveObject = function(x,y){

    //SETTINGS
    PARALAX_SPEED = 0.4;
    //SETTINGS

    for(var i = 0; i< this.array.length; i++){
      if(this.array[i].isBackground){
        this.array[i].x =(x/vnEngine.canvas.width/2) * (vnEngine.canvas.width - this.array[i].width)/2;
        this.array[i].y =(y/vnEngine.canvas.height/2) * (vnEngine.canvas.height - this.array[i].height)/2;
      }
      else if(this.array[i].isCharacter){
        this.array[i].x = this.array[i].centerX -((x / vnEngine.canvas.width * this.array[i].width) - this.array[i].width/2) *PARALAX_SPEED;
        this.array[i].y = this.array[i].centerY -((y / vnEngine.canvas.height * this.array[i].height/2) - this.array[i].height/2) *PARALAX_SPEED; 
      }
    }
  }
}

