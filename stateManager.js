function StateManager(){
  	this.speakTextDisplayObject = undefined;
	this.ScreenStatus = 0;
	this.noCheckScriptFlag =false;
	this.tempState = undefined;

	this.flagList = new Array;
  	this.scriptCounter;
  	this.tempScriptQueue = new Array;
  	this.tempScriptCounter =0;
  	this.jumpLabelList = new Array;

	this.clearAllState = function(){
		this.speakTextDisplayObject = undefined;
		this.ScreenStatus = 0;
		this.noCheckScriptFlag =false;
		this.tempState = undefined;
		this.flagList = new Array;
  		this.scriptCounter;
  		this.tempScriptQueue = new Array;
  		this.tempScriptCounter =0;
  		this.jumpLabelList = new Array;
  		this.initScript();
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
  }






}