const sideNavigation=document.querySelector(".sideNavigation");
sideBarToggle=document.querySelector(".fa-bars");
startContentul=document.querySelector(".startContent ul");
inputArea=document.querySelector(".inputArea input");
sendRequest=document.querySelector(".fa-paper-plane");
chatHistory=document.querySelector(".chatHistory ul");
startContent=document.querySelector(".startContent");
chatContent=document.querySelector(".chatContent");
results=document.querySelector(".results");
promptQuestions=[
    {
    question: "Write a thank you note on receiving a gift from friend",
    icon: "fa-solid fa-wand-magic-sparkles",
},

{
    question: "Write a sample code to learn javascript",
    icon: "fa-solid fa-code",
},
{
    question: "How to become a full stack developer",
    icon: "fa-solid fa-laptop-code",
},
{
    question: "How to become a Front-end Developer",
    icon: "fa-solid fa-database",
},
];
window.addEventListener("load", ()=>{
    promptQuestions.forEach((data)=>{
        let item=document.createElement("li");
        item.addEventListener("click", ()=>{
            getGeminiResponse(data.question, true);
        });
        item.innerHTML=`<div class="promptSuggestion">
        <p>${data.question}</p>
        <div class="icon"><i class="${data.icon}"></i></div>
        </div>`;
        startContentul.append(item);

    });
}); 
sideBarToggle.addEventListener("click",()=>{
    sideNavigation.classList.toggle("expandClose");
});
inputArea.addEventListener("keyup", (e)=>{
    if(e.target.value.length>0){
        sendRequest.style.display="inline";
    }else{
        sendRequest.style.display="none";

    }
});
sendRequest.addEventListener("click", ()=>{
    getGeminiResponse(inputArea.value, true); 
});
function getGeminiResponse(question, appendHistory){
    if(appendHistory){
let historyLi=document.createElement("li");
historyLi.addEventListener("click", ()=>{
    getGeminiResponse(question, false);
})
historyLi.innerHTML=`<i class="fa-regular fa-message"></i>${question}`;
chatHistory.append(historyLi);
    }
results.innerHTML="";
inputArea.value="";
startContent.style.display="none";
chatContent.style.display="block";
let resultTitle=`
<div class="resultTitle">
<img src="icon.png"/>
<p>${question}</p>
</div>
`;
let resultData=
`
<div class="resultsData">
<img src="https://www.gstatic.com/lamda/images/gemini_sparkle_red_4ed1cbfcbc6c9e84c31b987da73fc4168aec8445.svg"/>
<div class="loader">
<div class="animatedBG"></div>
<div class="animatedBG"></div>
<div class="animatedBG"></div>
</div>
</div>
`;
results.innerHTML+=resultTitle;
results.innerHTML+=resultData;

const APIURL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDu6r_IGsi3VnEULh6GA-0s3fqumHM2Gdw`;
fetch(APIURL, {
    method:"POST",
    body: JSON.stringify({
        contents:[{parts:[{text: question}]}]
    }),
}).then((response)=>response.json()).then((data)=>{
    const finaldata=document.querySelectorAll(".results .resultsData");
    finaldata.forEach((element)=>{
        element.remove();
    });
    let responseData=jsonEscape(data.candidates[0].content.parts[0].text);
    let responseArray=responseData.split("**");
    let newResponse="";
    for(let i=0; i<responseArray.length; i++){
        if(i==0 || i%2!==1)
            newResponse+=responseArray[i];
        else
        {
        newResponse+=responseArray[i].split(" ").join("&nbsp");
        }
    }
    let newResponse2=newResponse.split("*").join(" ");
    let textArea=document.createElement("textArea");
    textArea.innerHTML=newResponse2;

    results.innerHTML+=
    `
    <div class="resultResponse">
    <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_red_4ed1cbfcbc6c9e84c31b987da73fc4168aec8445.svg"/>
    <p id=typeEffect></p>
    </div>
    `;
    let newResponeData=newResponse2.split(" ");
    for(let j=0; j<newResponeData.length; j++){
        Timeout(j, newResponeData[j]+" ");
    }
});
}
const Timeout=(index,nextWord)=>{
    setTimeout(function(){
        document.getElementById("typeEffect").innerHTML+=nextWord;
    }, 75*index);
};
function newChat(){
    startContent.style.display="block";
    chatContent.style.display="none";
}
function jsonEscape(str){
    return str.replace(new RegExp("\r?\n\n", "g"), "<br>").
    replace(new RegExp("\r?\n", "g"), "<br>")
}
