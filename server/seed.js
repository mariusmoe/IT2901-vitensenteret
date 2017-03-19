const mongoose = require('mongoose'),
      User = require('./models/user'),
      Survey = require('./models/survey');
      Response = require('./models/response');

if (process.env.NODE_ENV === 'test') { return; }

let today = new Date();

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
  let thing = things[getRandomInt(0, things.length)];
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


module.exports = app => {

  function executeSeeds() {
    let numIterations = 200;
    let surveysPop = [];

    let questionModes = ['binary', 'star', 'single', 'multi', 'smiley', 'text'];
    let questionAnswerRanges = [2, 5, 0, 3, 1];
    for (let i = 0; i<numIterations; i++) {
      let numQuestions = getRandomInt(1,6);
      let questions = [];
      for (let qi = 0; qi < numQuestions; qi++) {
        let modeIndex = getRandomInt(0,5);
        let mode = questionModes[modeIndex];
        let alternatives = [];
        if (mode === 'multi' || mode === 'single') {
          let numAlternatives = getRandomInt(2,6);
          let remainingAlternatives = emotions.concat([]);

          for (let ai = 0; ai<numAlternatives; ai++) {
            let newAlternative = getRandomInt(0,remainingAlternatives.length);
            let alt = remainingAlternatives[newAlternative];
            alternatives.push(alt);
            remainingAlternatives.splice(newAlternative, 1);
          }
        } else {
          for (let i = 0; i < questionAnswerRanges[modeIndex]; i++) {
            alternatives.push(i);
          }
        }
        questions.push({
          'mode': mode,
          'required': true,
          'lang': {
            'no': {
              'txt': generateQuestion(),
              'options': alternatives,
            }
          }
        })
      }
      let s = {
        name: funnify(),
        comment: funnify(),
        questionlist: questions,
        date: new Date().setDate(today.getDate()-getRandomInt(0,2*365)),
        activationDate: new Date().setDate(today.getDate()-getRandomInt(0,2*365)),
        isPost: Math.random() < 0.5,
        active: Math.random() < 0.5,
        endMessage: {
          no: funnify(),
        },
      };
      surveysPop.push(s);
    }

    let responsesPop = [];
    let preSurveysPop = [];
    let preResponsesPop = [];

    Survey.insertMany(surveysPop).then(function(surveys) {
      delete surveysPop;
      for (let s of surveys) {
        populateResponses(responsesPop, s);
        if (s.isPost) {
          preSurveysPop.push(JSON.parse(JSON.stringify(s)));
          delete preSurveysPop[preSurveysPop.length-1]._id;
          preSurveysPop[preSurveysPop.length-1].postKey = s._id;
          preSurveysPop[preSurveysPop.length-1].isPost = false;
        }
      }

      Survey.insertMany(preSurveysPop).then(function(preSurveys) {
        for (let s of preSurveys) {
          populateResponses(responsesPop, s);
        }
        Response.insertMany(responsesPop).then(function() {
          const time = (new Date().getTime() - today.getTime());
          console.log('seed complete: ' + time + 'ms');
        });
      });
    });
  };


  Response.remove({}, success => {}).lean().then(Survey.remove({}, success => {}).lean()).then(() => { executeSeeds() });


}

let nicknames = ['Bob', 'Dave', 'Pete', 'Brad', 'Charlie', 'Sharon', 'Camilla', 'Julietta'];
function populateResponses(listToPopulate, survey) {
  for (let i = 0; i < 5; i++) {
    for (let nick of nicknames) {
      listToPopulate.push({
        nickname: nick,
        timestamp: new Date().setDate(today.getDate()-getRandomInt(0,2*365)),
        surveyId: survey._id,
        questionlist: []
      });
      for (let qo of survey.questionlist) {
        if (qo.mode === 'multi') {
          let numSelectedOptions = getRandomInt(1,qo.lang.no.options.length);
          let selectedOptions = [];
          let remainingOptions = qo.lang.no.options.concat([]);

          for (let i = 0; i < numSelectedOptions; i++) {
            let newOption = getRandomInt(0,remainingOptions.length);
            selectedOptions.push(qo.lang.no.options.indexOf(remainingOptions[newOption]));
            remainingOptions.splice(newOption,1);
          }
          listToPopulate[listToPopulate.length - 1].questionlist.push(selectedOptions);
        } else if (qo.mode === 'text') {
          listToPopulate[listToPopulate.length - 1].questionlist.push(funnify());
        } else {
          listToPopulate[listToPopulate.length - 1].questionlist.push(getRandomInt(0,qo.lang.no.options.length));
        }
      }
    }
  }
}
