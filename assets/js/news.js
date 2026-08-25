
(function(){
const names={"town-centre":"Bloggs Town Centre","north-bloggs":"North Bloggs","little-bloggs":"Little Bloggs","villages":"The Villages"};
let area="";
const q=new URLSearchParams(location.search).get("area");
if(names[q]) area=q;
if(!area){try{const s=sessionStorage.getItem("joeArea");if(names[s])area=s}catch(e){}}
if(!area)return;

const allGrid=document.getElementById("allNewsGrid");
const localGrid=document.getElementById("localNewsGrid");
const personalised=document.getElementById("personalisedNews");
const heading=document.getElementById("personalisedNewsHeading");
const intro=document.getElementById("personalisedNewsIntro");
const allHeading=document.getElementById("allNewsHeading");
const allIntro=document.getElementById("allNewsIntro");
if(!allGrid||!localGrid)return;

Array.from(allGrid.querySelectorAll(".news-card")).forEach(card=>{
  if(card.dataset.area===area){
    localGrid.appendChild(card);
  }
});
if(personalised)personalised.style.display="";
if(heading)heading.textContent="Latest from "+names[area];
if(intro)intro.textContent="News and updates specifically relevant to "+names[area]+".";
if(allHeading)allHeading.textContent="More from across Bloggs Town";
if(allIntro)allIntro.textContent="Other news and updates from across the constituency.";
})();
