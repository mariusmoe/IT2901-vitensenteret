const mongoose = require('mongoose'),
      User = require('./models/user'),
      Survey = require('./models/survey');

// TODO only do this if in dev mode
module.exports = app => {
   Survey.remove({}, (result) => {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }

      var things = ['window','button','cup','grid paper','tree','chocolate','purse','sandal','television','balloon','nail file','screw','cookie jar','cat','soy sauce packet','tv','puddle','shirt','hair tie',
      'glow stick','house','tire swing','eraser','boom box','playing card','mp3 player','helmet','air freshener','monitor','picture frame'];
      var verbs = ['cooking','smelling','watching','flower','join','reduce','suffer','shade','tour','overflow','whisper','slow','precede','branch','coach','lock','prefer','kill','scream','work','confuse','fool','pass',
      'yawn','shock','save','camp','man up','depend','stare','describe','warm','water','introduce','recognise','repair','tease','knot','exist','trap','identify','train','follow','hum','cough','program','preserve',
      'rush','entertain','divide','box','whine','last','shiver','snore','relax','explain','obey','paste','grin','appear','strengthen'];
      var adjectives = ['adorable','adventurous','aggressive','agreeable','alert','alive','amused','angry','annoyed','annoying','anxious','arrogant','ashamed','attractive','average','awful','bad','beautiful','better',
      'bewildered','black','bloody','blue','blue-eyed','blushing','bored','brainy','brave','breakable','bright','busy','calm','careful','cautious','charming','cheerful','clean','clear','clever','cloudy','clumsy',
      'colorful','combative','comfortable','concerned','condemned','confused','cooperative','courageous','crazy','creepy','crowded','cruel','curious','cute','dangerous','dark','dead','defeated','defiant','delightful',
      'depressed','determined','different','difficult','disgusted','distinct','disturbed','dizzy','doubtful','drab','dull','eager','easy','elated','elegant','embarrassed','enchanting','encouraging','energetic',
      'enthusiastic','envious','evil','excited','expensive','exuberant','fair','faithful','famous','fancy','fantastic','fierce','filthy','fine','foolish','fragile','frail','frantic','friendly','frightened','funny',
      'gentle','gifted','glamorous','gleaming','glorious','good','gorgeous','graceful','grieving','grotesque','grumpy','handsome','happy','healthy','helpful','helpless','hilarious','homeless','homely','horrible',
      'hungry','hurt','ill','important','impossible','inexpensive','innocent','inquisitive','itchy','jealous','jittery','jolly','joyous','kind','lazy','light','lively','lonely','long','lovely','lucky','magnificent',
      'misty','modern','motionless','muddy','mushy','mysterious','nasty','naughty','nervous','nice','nutty','obedient','obnoxious','odd','old-fashioned','open','outrageous','outstanding','panicky','perfect','plain',
      'pleasant','poised','poor','powerful','precious','prickly','proud','puzzled','quaint','real','relieved','repulsive','rich','scary','selfish','shiny','shy','silly','sleepy','smiling','smoggy','sore','sparkling',
      'splendid','spotless','stormy','strange','stupid','successful','super','talented','tame','tender','tense','terrible','testy','thankful','thoughtful','thoughtless','tired','tough','troubled','ugliest','ugly',
      'uninterested','unsightly','unusual','upset','uptight','vast','victorious','vivacious','wandering','weary','wicked','wide-eyed','wild','witty','worrisome','worried','wrong','zany','zealous'];

      var emotions = ['sad','happy','angry','jealous','joyous','disgusted','surprised','bored'];


      function funnify() {
        let thing = getRandomInt(0, things.length);
        let emotion = getRandomInt(0,emotions.length);
        let verb = getRandomInt(0,verbs.length);
        return `${things[thing]} for ${emotions[emotion]} ${verbs[verb]}ing`
      }

      // Generator for a paragraph of funny text.
      function generateQuestion() {
        let thing = getRandomInt(0, things.length);
        let emotion = emotions[getRandomInt(0,emotions.length)];
        let emotion2 = emotions[getRandomInt(0,emotions.length)];
        let verb = verbs[getRandomInt(0,verbs.length)];
        let adjective = adjectives[getRandomInt(0,adjectives.length)];
        let adjective2 = adjectives[getRandomInt(0,adjectives.length)];
        // Chose a random flavour for some variation in the article-descriptions.
        let question = getRandomInt(1, 11);
        switch (question){
          case 1:
            return  `What would you do if you had ${thing}?`;
          case 2:
            return `When you ${verb}, it is extremely important to have a ${thing}. This ${thing} is ${adjective} for you! Agree?`;
          case 3:
            return `Do you feel ${adjective}?`;
          case 4:
            return `Are you ${emotion}?`;
          case 5:
            return `In the mood for something ${adjective}?`;
          case 6:
            return `This ${thing} is not ${adjective} enough for me. Do you want it?`;
          case 7:
            return `Are you ${emotion} and ready to rumble?`;
          case 8:
            return `Look at this ${adjective} ${thing}. You know you want it. Right?`;
          case 9:
            return `Well... it's ${adjective}. Need I say more?`;
          case 10:
            return `${adjective} and ${adjective2}. Perfect for a ${verb} party, don't you think?`;
          default:
            return `${adjective} ${thing} is perfect if you want to ${verb}. Borrow it now for ${adjective2} experience.`;
        }
      }

      let today = new Date();
      let surveysPop = [];

      let questionModes = ['binary', 'star', 'multi', 'smiley', 'text'];
      let questionAnswerRanges = [2, 5, 0, 3, 1];

      for (let i = 0; i<4000; i++) {
        let numQuestions = getRandomInt(1,6);
        let questions = [];
        for (let qi = 0; qi<numQuestions; qi++) {
          let numAnswers = getRandomInt(40,100);
          let answers = [];

          let modeIndex = getRandomInt(0,4);
          let mode = questionModes[modeIndex]; // not text.
          let alternatives;
          if (mode === 'multi') {
            let numAlternatives = getRandomInt(2,6);
            alternatives = [];
            for (let ai = 0; ai<numAlternatives; ai++) {
              let alt = emotions[getRandomInt(0,emotions.length)];
              alternatives.push(alt);
            }
            for (let answeri = 0; answeri < numAnswers; answeri++) {
              let currAnswer = getRandomInt(0, alternatives.length - 1);
              answers.push(currAnswer);
            }

          } else {
            for (let answeri = 0; answeri < numAnswers; answeri++) {
              let currAnswer = getRandomInt(0, questionAnswerRanges[modeIndex]);
              answers.push(currAnswer);
            }
          }
          questions.push({
            'mode': mode,
            'lang': {
              'no': {
                'txt': generateQuestion(),
                'options': alternatives,
              }
            },
            'answer': answers
          })
        }

        let s = {
          name: funnify(),
          comment: funnify(),
          questionlist: questions,
          date: new Date().setDate(today.getDate()-getRandomInt(0,2*365)),
          active: Math.random() < 0.5,
          endMessage: {
            no: funnify(),
          },
        };
        surveysPop.push(s);
      }
      Survey.insertMany(surveysPop);
      const time = (new Date().getTime() - today.getTime());
      console.log('seed complete: ' + time + 'ms');
  });
}
