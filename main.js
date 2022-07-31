// Fetching resources
const requestURL = "https://t-cool.github.io/phonetic-symbols-to-English-text/dict.json";
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

// initial settings for TTS
const voice = new talkify.Html5Player();
voice.forceLanguage('en');
voice.setRate(1);

request.onload = function() {
  // DB
  let asset = JSON.parse(request.response);
  asset = asset[0];

  // auxiliary function
  function remove_punc(words){
    let words_preserved = [];
    // Line break handling
    words = words.split('\n\n\n');
    words = words.join(' ');
    words = words.split('\n\n');
    words = words.join(' ');
    words = words.split('\n');
    words = words.join(' ');
    words = words.split(' ');
    console.log(words);
    for (w of words) {
      lowerWord = w.toLowerCase();
      let punct_str = lowerWord.replace(/\!|\(|\)|\"|\#|\$|\%|\&|\\|\'|\(|\)|\*|\+|\,|\-|\.|\/|\:|\;|\<|\=|\>|\/|\?|\@|\[|\\|\\|\]|\^|\_|\`|\{|\||\}|\~|\«|\»|\ /g, '');
      words_preserved.push([w, punct_str]);
    }
    return words_preserved
  }

  function get_cmu(words_array){
  let result = words_array.map(wordArray => {
      wordArray[1] = asset[wordArray[1]];
      if(wordArray[1]==undefined){
        wordArray[1] = [`*${wordArray[0]}*`];
      }

      return wordArray
    })

  return result;
  }

  function convert(words_in){
    // converts a string to an array format
    let words_array = remove_punc(words_in);
    // =>　[['Are', 'are'],['you', 'you'] ]

    let cmu_words_array = get_cmu(words_array);
    // =>　[['Are, ['ɑr', 'ər']], ['You',['ju']] ]

    return cmu_words_array
  }

  // UI
  document.getElementById("convert").addEventListener('click',(e)=>{
    let inputText = document.querySelector("#text").value;
    let converted_data = convert(inputText);
    for (wordIPA of converted_data){
      makeBox(wordIPA[0],wordIPA[1]);
    }

    hideElements(); 
  })

  function makeBox(word, sounds){
    const boxDom = document.createElement("form");
    boxDom.className = "item";
    containerB.appendChild(boxDom);

    const wordDom = document.createElement("div");

    // word UI
    wordDom.innerText = word;
    boxDom.appendChild(wordDom);

    // options UI
    const soundsDom = document.createElement("select");
    sounds.map(value => soundsDom.append(new Option(value)));

    boxDom.appendChild(soundsDom);
    boxDom.addEventListener('click',function(e){
      // TTS
      voice.playText(word);
    })
  }

  function hideElements(){
    document.getElementById("caption").style.display = "none";
    document.getElementById("convert").style.display = "none";
    document.getElementById("text").style.display = "none";
  }
}
