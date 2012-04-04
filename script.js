var script = new Array;
 
  //splash screen must be defined before init menu
  script.push({type:'changeBackground',imageLabel:'logo'});
  script.push({type:'delay',ms:2000});
  script.push({type:'playVideo',videoLabel:'wongIT'});
  script.push({type:'initMenu'});

  //Game start point always start with "startGame" jumpLabel
  script.push({type:'addJumpLabel', jumpLabel:'startGame'});

  script.push({type:'addFlag',flagLabel :'F1',flagValue:'false'});
  script.push({type:'addFlag',flagLabel :'F2',flagValue:'false'});

  script.push({type:'addJumpLabel', jumpLabel:'A1'});

  script.push({type:'if',
              op:'==',
              exp1 : {type:'getFlag',flagLabel:"F2"}, 
              exp2:'true',
              right : {type:'editFlag',flagLabel:"F1", flagValue:'true'},
              wrong :undefined});


  script.push({type:'playBGM',soundLabel: 'awang'});
  script.push({type:'changeBackground',imageLabel:{color:Graphics.getRGB(0,0,0)}});
  script.push({type:'speak' ,character :'Aku', speak:'Aku merasa aneh'});
  script.push({type:'speak' ,character :'Aku', speak:'Tubuhku terasa berat'});
  script.push({type:'speak' ,character :'Aku', speak:'Aku bisa melihat tubuhku terbuat dari batu'});
  script.push({type:'speak' ,character :'Aku', speak:'Ada apa ini? dengan panik aku meraba tubuhku'});
  script.push({type:'speak' ,character :'Aku', speak:'Kenapa? kenapa tubuhku terbuat dari batu?'});
  script.push({type:'speak', character: 'Aku', speak: 'Aku mendengar teriakan teman-temanku'});
  script.push({type:'speak' , character : 'Aku' , speak: 'Aku mencoba melihat sekelilingku'});
  script.push({type:'speak',character:'Aku',speak: 'Yang aku lihat hanyalah hitam'});
  script.push({type:'playBGM',soundLabel: 'normal'});

  script.push({type:'changeBackground',imageLabel:'roomNight'});

  script.push({type: 'speak' , character:'Aku', speak:'Aku terbangun dari mimpiku'});
  script.push({type:'speak' ,character :'Aku', speak: 'Tubuhku masih kaku tidak bisa digerakan'});
  script.push({type:'speak' ,character :'Aku', speak: 'Dengan perlahan aku membuka jendala kamar ku'});
  script.push({type:'changeBackground',imageLabel:'roomDay'});
  script.push({type:'speak' ,character :'Aku', speak: 'Cahaya matahari yang menyilaukan masuk kedalam kamarku'});
  script.push({type:'speak' ,character :'Aku', speak: 'Tanpa sadar aku menutup mataku yang masih beradaptasi dengan sinar fajar'});
  script.push({type: 'speak' , character:'Aku', speak:'hmm..'});
  script.push({type: 'speak' , character:'Aku', speak:'Mimpi yang aneh'});
  script.push({type: 'speak' ,character:'Aku' , speak: 'Apa yang harus aku lakukan sekarang?'});
  script.push({type: 'speak' , character:'Aku', speak:'hmm..'});
  script.push({type:'speak' ,character: 'Aku' ,speak: 'Aku bersiap untuk berangkat ke kampus'});

  script.push({type:'changeBackground',imageLabel:'roadDay'});

  script.push({type:'speak' ,character: 'Aku' ,speak: 'Lanjut Next time =p'});









/*
  script.push({type:'playBGM',soundLabel: 'normal'});
  script.push({type:'showCharacter',imageLabel :'charaClara1', position: 'center'});
  script.push({type:'pauseScript'});
  script.push({type:'playBGM',soundLabel: 'normal'});
  script.push({type:'showCharacter',imageLabel :'charaLily1',position:'right'});
  script.push({type:'pauseScript'});

  script.push({type:'changeBackground',imageLabel:'2'});
  script.push({type:'speak', character :'rina',speak : 'apaan pagi-pagi udah halo?'});
  script.push({type:'changeBackground',imageLabel:'background2'});
  script.push({type:'pauseScript'});
  script.push({type:'hideCharacter',position :'right'});
  script.push({type:'pauseScript'});
  script.push({type:'hideCharacter',position :'left'});
  script.push({type:'pauseScript'});
  script.push({type:'changeBackground',imageLabel:'background2'});
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
*/