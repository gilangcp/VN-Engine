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
  script.push({type:'speak', character :'rina',speak : 'apaan pagi-pagi udah halo? nya\
    aaaaaaaaaaaaaaafwrhgwerheherherherhwerherherh\
    erhwerhwerhwerhwergerguwerhgiherughierwrhghweri\
    erhwerhiererighiergierhgwerigheruhgtrhgierghegjo'});
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
