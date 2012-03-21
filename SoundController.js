function SoundController(){
	var self = this;
	this.bgm;

	if(localStorage.getItem("bgmVolume") >-1){
		this.bgmVolume = localStorage.getItem("bgmVolume");
	}
	else{
		this.bgmVolume = 50;
	}

	if(localStorage.getItem("sfxVolume") >-1 ){
		this.sfxVolume =localStorage.getItem("sfxVolume")  ;
	}
	else{
		this.sfxVolume =50;
	}

	this.playBGM = function(soundLabel){
		if(soundLabel!= undefined){
		  if(this.bgm != undefined && soundLabel != this.bgm){
		    this.stopBGM(this.bgm);
		  }
		  this.bgm = soundLabel;
		  soundManager.play(this.bgm,{volume:this.bgmVolume,onfinish: function() {
		  self.playBGM();
		}});
		  vnEngine.checkScript();
		}
		else if (this.bgm != undefined){
		  soundManager.play(this.bgm,{volume:this.bgmVolume,onfinish: function() {
		  self.playBGM();
		}});
		}
	}

	this.playEffect = function(soundLabel){
    	soundManager.play(soundLabel , {volume : this.sfxVolume});
  	}

  	this.stopBGM = function(){
    	soundManager.stop(this.bgm);
    	this.bgm = undefined; 
  	}
  	this.changeBGMVolume = function(volume){
  		if(this.bgm != undefined){
  		soundManager.getSoundById(this.bgm).setVolume(volume);
	  }
  		this.bgmVolume = volume;
  		localStorage.setItem("bgmVolume" , volume);
  	}
  	this.changeSoundEffectVolume = function(volume){
  		this.sfxVolume = volume;
  		localStorage.setItem("sfxVolume" , volume);
  	}

  	this.getBGMVolume = function(){
  		return this.bgmVolume;
  	}

  	this.getSFXVolume = function(){
  		return this.sfxVolume;
  	}

}