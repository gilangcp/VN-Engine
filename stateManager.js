function StateManager(){
  	this.speakTextDisplayObject = undefined;
	this.ScreenStatus = 0;
	this.noCheckScriptFlag =false;
	this.tempState = undefined;

  	this.scriptCounter = 0;
  	this.tempScriptQueue = new Array;
  	this.tempScriptCounter =0;

  	this.jumpLabelList = new Array;
	this.flagList = new Array;
	this.defaultflagList = new Array;

	this.clearAllState = function(){
		this.speakTextDisplayObject = undefined;
		this.ScreenStatus = 0;
		this.noCheckScriptFlag =false;
		this.tempState = undefined;
  		this.scriptCounter = 0;
  		this.tempScriptQueue = new Array;
  		this.tempScriptCounter =0;
  		this.flagList = this.defaultflagList
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




}