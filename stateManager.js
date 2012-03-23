function StateManager(){
  	this.speakTextDisplayObject = undefined;
	this.ScreenStatus = 0;
	this.noCheckScriptFlag =false;
	this.tempState = undefined;

	this.clearAllState = function(){
		this.speakTextDisplayObject = undefined;
		this.ScreenStatus = 0;
		this.noCheckScriptFlag =false;
		this.tempState = undefined;
	}
}