function StateManager(){
  this.speakTextDisplayObject = undefined;
	this.ScreenStatus = 0;
	this.noCheckScriptFlag =false;
	this.tempState = undefined;

  this.scriptCounter = 0;
  this.tempScriptQueue = new Array;
  this.tempScriptCounter =0;

  this.displayCharacterList = {left: undefined , right: undefined , center: undefined};
  this.backgroundImage = undefined;
  this.bgm = undefined;

  this.jumpLabelList = new Array;
	this.flagList = new Array;
	this.defaultflagList = new Array;

	this.clearAllState = function(){
    this.currentImage = undefined;
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

  this.saveState = function(){
    console.log(this.displayCharacterList);
  	var state = {
  		SC   :this.scriptCounter,
  		TSQ  :this.tempScriptQueue,
  		TSC  :this.tempScriptCounter,
  		JLL  :this.jumpLabelList,
  		FL   :this.flagList,
  		DFL  :this.defaultflagList,
  		BGM	 :this.bgm,
  		CHR	 :this.displayCharacterList,
  		BGI  :this.backgroundImage,
      SCH  :this.speakTextDisplayObject.text,
      SNA  :vnEngine.stage.getChildAt(vnEngine.stage.getChildIndex(this.speakTextDisplayObject)-1).text
  	};

  	localStorage.setItem("state",JSON.stringify(state));
  	console.log("state Saved");
  }

  this.loadState = function(){
   console.log("Loading state");
  	var state = JSON.parse(localStorage.getItem("state"));
      this.jumpLabelList = state.JLL;
      this.flagList = state.FL;
      this.defaultflagList = state.DFL;

      vnEngine.soundController.playBGM(state.BGM);

      vnEngine.graphicsManager.changeBackground(state.BGI, function(){
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

       vnEngine.stateManager.tempScriptQueue = state.TSQ;
       if(vnEngine.stateManager.tempScriptCounter >0){
          vnEngine.stateManager.tempScriptCounter = state.TSC;
        }

        vnEngine.stateManager.speakTextDisplayObject.text = state.SCH;
        vnEngine.stage.getChildAt(vnEngine.stage.getChildIndex(vnEngine.stateManager.speakTextDisplayObject)-1).text = state.SNA;
        vnEngine.stateManager.scriptCounter = state.SC;
                 

        //Remove rigth click menu
        vnEngine.stateManager.noCheckScriptFlag = vnEngine.stateManager.tempState;
        vnEngine.stage.removeChildAt(vnEngine.stage.getNumChildren()-1);
        if(vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable == false){
        vnEngine.stage.getChildAt(vnEngine.stage.getNumChildren()-1).clickable = true;
        }
        vnEngine.stateManager.ScreenStatus=2;

        //Option
        if(script[vnEngine.stateManager.scriptCounter-1].type == "option"){
          vnEngine.stateManager.scriptCounter--;
          vnEngine.checkScript();
        }

       console.log("state Loaded"); 
      });
  }
}

