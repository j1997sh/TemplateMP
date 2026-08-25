/* Consolidated form and journey behaviours */

/* ---- campaign-actions.js ---- */

(function(){
  function getArea(){
    try { return sessionStorage.getItem("joeArea") || ""; } catch(e){ return ""; }
  }
  function setData(key,value){
    try { sessionStorage.setItem(key,value); } catch(e){}
  }

  document.querySelectorAll(".campaign-action-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();

      const data = new FormData(form);
      const issue = form.dataset.issue || "";
      const hint = form.dataset.areaHint || "";
      const area = getArea() || hint || "";

      setData("lastCampaignIssue", issue);
      setData("lastCampaignArea", area);
      setData("lastCampaignUpdates", data.get("updates") ? "yes" : "no");
      setData("lastCampaignFirstName", data.get("first_name") || "");

      const url = new URL("thanks.html", window.location.href);
      if(issue) url.searchParams.set("issue", issue);
      if(area) url.searchParams.set("area", area);
      window.location.href = url.toString();
    });
  });
})();

/* ---- campaign-thanks.js ---- */

(function(){
  const params = new URLSearchParams(window.location.search);
  const issue = params.get("issue") || "";
  const area = params.get("area") || "";
  const areaNames = {
    "town-centre":"Bloggs Town Centre",
    "north-bloggs":"North Bloggs",
    "little-bloggs":"Little Bloggs",
    "villages":"The Villages"
  };

  const issueMap = {
    health: {
      label: "better GP access",
      nextTitle: "Tell Joe about local healthcare",
      nextText: "A short residents survey will help Joe understand how easy or difficult it is to access care locally.",
      nextHref: "../have-your-say.html?issue=health"
    },
    business: {
      label: "local business",
      nextTitle: "Are you a local business?",
      nextText: "Tell Joe what would make it easier to invest, employ and grow in Bloggs Town.",
      nextHref: "../have-your-say.html?issue=business"
    },
    crime: {
      label: "safer neighbourhoods",
      nextTitle: "Tell Joe what is happening near you",
      nextText: "Share the crime or antisocial behaviour issue you think needs the most attention.",
      nextHref: "../have-your-say.html?issue=crime"
    },
    transport: {
      label: "better roads and transport",
      nextTitle: "Where is the biggest transport problem?",
      nextText: "Tell Joe which local road, junction or transport issue should be prioritised.",
      nextHref: "../have-your-say.html?issue=transport"
    },
    "local-services": {
      label: "protecting local services",
      nextTitle: "Which local service matters most?",
      nextText: "Tell Joe what residents in your community most need protected or improved.",
      nextHref: "../have-your-say.html?issue=local-services"
    }
  };

  const cfg = issueMap[issue] || {
    label: "this local campaign",
    nextTitle: "Tell Joe what matters",
    nextText: "Take a short residents survey and help shape Joe’s local priorities.",
    nextHref: "../have-your-say.html"
  };

  let firstName = "";
  try { firstName = sessionStorage.getItem("lastCampaignFirstName") || ""; } catch(e){}

  const heading = document.getElementById("thanksHeading");
  const text = document.getElementById("thanksText");
  const title = document.getElementById("nextActionTitle");
  const copy = document.getElementById("nextActionText");
  const button = document.getElementById("nextActionButton");

  if(heading){
    heading.textContent = (firstName ? "Thanks, " + firstName + "." : "Thank you.") + " You’re backing " + cfg.label + ".";
  }
  if(text){
    const areaText = areaNames[area] ? " We’ll keep updates relevant to " + areaNames[area] + "." : "";
    text.textContent = "Your support has been recorded in this demo journey." + areaText;
  }
  if(title) title.textContent = cfg.nextTitle;
  if(copy) copy.textContent = cfg.nextText;
  if(button) button.href = cfg.nextHref;

  const shareEmail = document.getElementById("shareEmail");
  if(shareEmail){
    const subject = encodeURIComponent("Joe Bloggs MP campaign");
    const body = encodeURIComponent("I’ve just backed Joe Bloggs’ campaign for " + cfg.label + ". You can take a look here: " + window.location.origin + "/campaigns.html");
    shareEmail.href = "mailto:?subject=" + subject + "&body=" + body;
  }

  const copyLink = document.getElementById("copyLink");
  if(copyLink){
    copyLink.addEventListener("click", async function(){
      const target = window.location.origin + "/campaigns.html";
      try{
        await navigator.clipboard.writeText(target);
        const old = copyLink.textContent;
        copyLink.textContent = "Copied";
        setTimeout(function(){ copyLink.textContent = old; }, 1600);
      }catch(e){
        copyLink.textContent = "Copy unavailable";
      }
    });
  }
})();

/* ---- event-rsvp.js ---- */

(function(){
  function getCurrentArea(){
    try { return sessionStorage.getItem("joeArea") || ""; } catch(e){ return ""; }
  }
  function setSession(key,value){
    try { sessionStorage.setItem(key,value); } catch(e){}
  }

  document.querySelectorAll(".event-rsvp-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      const data = new FormData(form);

      const eventSlug = form.dataset.event || "";
      const eventTitle = form.dataset.eventTitle || "";
      const issue = form.dataset.issue || "general";
      const eventArea = form.dataset.area || "";
      const date = form.dataset.date || "";
      const location = form.dataset.location || "";
      const visitorArea = getCurrentArea();

      setSession("lastEventSlug", eventSlug);
      setSession("lastEventTitle", eventTitle);
      setSession("lastEventIssue", issue);
      setSession("lastEventArea", eventArea);
      setSession("lastEventDate", date);
      setSession("lastEventLocation", location);
      setSession("lastEventFirstName", data.get("first_name") || "");
      setSession("lastEventUpdates", data.get("updates") ? "yes" : "no");

      const url = new URL("thanks.html", window.location.href);
      if(eventSlug) url.searchParams.set("event", eventSlug);
      if(issue) url.searchParams.set("issue", issue);
      if(visitorArea) url.searchParams.set("area", visitorArea);
      else if(eventArea && eventArea !== "all") url.searchParams.set("area", eventArea);

      window.location.href = url.toString();
    });
  });
})();

/* ---- event-thanks.js ---- */

(function(){
  const params = new URLSearchParams(window.location.search);
  const issue = params.get("issue") || "general";
  const areaKey = params.get("area") || "";

  const areaNames = {
    "town-centre":"Bloggs Town Centre",
    "north-bloggs":"North Bloggs",
    "little-bloggs":"Little Bloggs",
    "villages":"The Villages"
  };

  let title="", date="", location="", firstName="";
  try{
    title = sessionStorage.getItem("lastEventTitle") || "";
    date = sessionStorage.getItem("lastEventDate") || "";
    location = sessionStorage.getItem("lastEventLocation") || "";
    firstName = sessionStorage.getItem("lastEventFirstName") || "";
  }catch(e){}

  const heading = document.getElementById("bookingHeading");
  const meta = document.getElementById("bookingMeta");

  if(heading){
    heading.textContent = firstName ? "You’re booked in, " + firstName + "." : "You’re booked in.";
  }
  if(meta){
    meta.textContent = (title ? title + ". " : "") + (date ? date + ". " : "") + (location ? location + "." : "");
  }

  const cfg = {
    business:{
      title:"Tell Joe what local businesses need",
      text:"A short business question helps Joe understand the pressures local employers are facing.",
      href:"../have-your-say.html?issue=business"
    },
    transport:{
      title:"Report the transport issue that matters most",
      text:"Tell Joe whether roads, buses, congestion or junction safety should be the priority.",
      href:"../have-your-say.html?issue=transport"
    },
    crime:{
      title:"What is making residents feel less safe?",
      text:"Share the local safety issue you think Joe should focus on next.",
      href:"../have-your-say.html?issue=crime"
    },
    "local-services":{
      title:"Which local service matters most?",
      text:"Tell Joe what residents in your community most need protected or improved.",
      href:"../have-your-say.html?issue=local-services"
    },
    casework:{
      title:"Need to send Joe more detail?",
      text:"Use the casework page if you need help with a specific constituency issue.",
      href:"../get-help.html"
    },
    general:{
      title:"What should Joe focus on next?",
      text:"Take a short residents survey and help shape Joe’s local priorities.",
      href:"../have-your-say.html"
    }
  }[issue] || {
    title:"What should Joe focus on next?",
    text:"Take a short residents survey and help shape Joe’s local priorities.",
    href:"../have-your-say.html"
  };

  const nextTitle = document.getElementById("eventNextTitle");
  const nextText = document.getElementById("eventNextText");
  const nextButton = document.getElementById("eventNextButton");
  if(nextTitle) nextTitle.textContent = cfg.title;
  if(nextText) nextText.textContent = cfg.text;
  if(nextButton) nextButton.href = cfg.href;

  const areaName = areaNames[areaKey];
  const localTitle = document.getElementById("localEventsTitle");
  const localText = document.getElementById("localEventsText");
  if(areaName){
    if(localTitle) localTitle.textContent = "More happening in " + areaName;
    if(localText) localText.textContent = "See other events, campaigns and updates relevant to " + areaName + ".";
  }
})();

/* ---- survey-personalisation.js ---- */

(function(){
  const params = new URLSearchParams(window.location.search);
  const issue = params.get("issue") || "";
  let areaKey = params.get("area") || "";
  try { if(!areaKey) areaKey = sessionStorage.getItem("joeArea") || ""; } catch(e){}

  const areaNames = {
    "town-centre":"Bloggs Town Centre",
    "north-bloggs":"North Bloggs",
    "little-bloggs":"Little Bloggs",
    "villages":"The Villages"
  };
  const issueConfig = {
    health:{
      heading:"Tell Joe about healthcare",
      intro:"How easy is it to access the healthcare you need",
      placeholder:"Tell Joe about GP appointments, dentists, waiting times or another local healthcare issue.",
      option:"Healthcare"
    },
    business:{
      heading:"Tell Joe about local business",
      intro:"What would make the biggest difference to businesses",
      placeholder:"Tell Joe what is making it harder to invest, employ people or grow locally.",
      option:"Local business and high streets"
    },
    crime:{
      heading:"Tell Joe about safety where you live",
      intro:"What is making residents feel less safe",
      placeholder:"Tell Joe about crime, antisocial behaviour or policing where you live.",
      option:"Crime"
    },
    transport:{
      heading:"Tell Joe about roads and transport",
      intro:"What is the biggest roads or transport issue",
      placeholder:"Tell Joe about potholes, congestion, buses, junctions or another local transport problem.",
      option:"Roads and transport"
    },
    "local-services":{
      heading:"Tell Joe about local services",
      intro:"Which local services matter most",
      placeholder:"Tell Joe which local service you want protected or improved.",
      option:"Local services"
    }
  };

  const heading = document.getElementById("surveyHeading");
  const intro = document.getElementById("surveyIntro");
  const textarea = document.getElementById("surveyTextarea");
  const select = document.getElementById("issueSelect");
  const cfg = issueConfig[issue];
  const areaName = areaNames[areaKey];

  if(cfg){
    if(heading) heading.textContent = cfg.heading;
    if(intro){
      intro.textContent = cfg.intro + (areaName ? " in " + areaName + "." : " in Bloggs Town.");
    }
    if(textarea) textarea.placeholder = cfg.placeholder;
    if(select){
      Array.from(select.options).forEach(function(opt){
        if(opt.textContent.trim() === cfg.option) opt.selected = true;
      });
    }
  }else if(areaName){
    if(heading) heading.textContent = "What matters in " + areaName + "?";
    if(intro) intro.textContent = "Tell Joe what is working, what is not and what you want him to focus on in " + areaName + ".";
    if(textarea) textarea.placeholder = "What would you most like Joe to change or focus on in " + areaName + "?";
  }
})();


/* ---- preference centre ---- */
(function(){
  const form = document.getElementById("preferenceForm");
  if(!form) return;
  const names={"town-centre":"Bloggs Town Centre","north-bloggs":"North Bloggs","little-bloggs":"Little Bloggs","villages":"The Villages"};
  let area="";
  try{area=sessionStorage.getItem("joeArea")||""}catch(e){}
  if(names[area]){
    const title=document.getElementById("prefLocalTitle");
    const text=document.getElementById("prefLocalText");
    const intro=document.getElementById("preferenceIntro");
    if(title) title.textContent="Updates from "+names[area];
    if(text) text.textContent="News, campaigns and events specifically relevant to "+names[area]+".";
    if(intro) intro.textContent="Choose what you want to hear about, including updates specifically from "+names[area]+".";
  }

  try{
    const saved=JSON.parse(sessionStorage.getItem("joePreferences")||"{}");
    ["local","campaigns","events","monthly"].forEach(function(k){
      if(typeof saved[k]==="boolean"){
        const el=form.querySelector('[name="'+k+'"]');
        if(el) el.checked=saved[k];
      }
    });
  }catch(e){}

  form.addEventListener("submit",function(e){
    e.preventDefault();
    const prefs={};
    ["local","campaigns","events","monthly"].forEach(function(k){
      const el=form.querySelector('[name="'+k+'"]');
      prefs[k]=!!(el&&el.checked);
    });
    try{sessionStorage.setItem("joePreferences",JSON.stringify(prefs))}catch(e){}
    const confirm=document.getElementById("preferenceConfirm");
    if(confirm) confirm.classList.add("visible");
  });
})();

/* ---- soft volunteer prompts ---- */
(function(){
  document.querySelectorAll("[data-volunteer-prompt]").forEach(function(prompt){
    const selected=[];
    prompt.querySelectorAll("[data-volunteer]").forEach(function(button){
      button.addEventListener("click",function(){
        button.classList.toggle("selected");
        const value=button.dataset.volunteer;
        const i=selected.indexOf(value);
        if(i>=0) selected.splice(i,1); else selected.push(value);
        try{sessionStorage.setItem("joeVolunteerInterests",JSON.stringify(selected))}catch(e){}
        const done=prompt.querySelector("[data-volunteer-done]");
        if(done) done.classList.toggle("visible",selected.length>0);
      });
    });
  });
})();

/* ---- reveal volunteer prompt after survey engagement ---- */
(function(){
  const surveyForms=document.querySelectorAll("form");
  const volunteerSection=document.getElementById("surveyVolunteerSection");
  if(!volunteerSection) return;
  surveyForms.forEach(function(form){
    form.addEventListener("submit",function(){
      setTimeout(function(){
        volunteerSection.style.display="";
        const inner=document.getElementById("surveyVolunteerPrompt");
        if(inner) inner.style.display="";
      },250);
    });
  });
})();


/* ---- proper sign-up page ---- */
(function(){
  const form=document.getElementById("signupForm");
  if(!form) return;

  const names={"town-centre":"Bloggs Town Centre","north-bloggs":"North Bloggs","little-bloggs":"Little Bloggs","villages":"The Villages"};
  let area="";
  try{area=sessionStorage.getItem("joeArea")||""}catch(e){}
  if(names[area]){
    const heading=document.getElementById("signupHeading");
    const intro=document.getElementById("signupIntro");
    const title=document.getElementById("signupLocalTitle");
    const copy=document.getElementById("signupLocalText");
    if(heading) heading.textContent="Get updates from "+names[area];
    if(intro) intro.textContent="Choose the updates you want, including news specifically from "+names[area]+".";
    if(title) title.textContent="Updates from "+names[area];
    if(copy) copy.textContent="News, campaigns and events specifically relevant to "+names[area]+".";
  }

  form.addEventListener("submit",function(e){
    e.preventDefault();
    const data=new FormData(form);
    const prefs={
      local:!!data.get("local"),
      campaigns:!!data.get("campaigns"),
      events:!!data.get("events"),
      monthly:!!data.get("monthly")
    };
    try{
      sessionStorage.setItem("joePreferences",JSON.stringify(prefs));
      sessionStorage.setItem("joeSignedUp","yes");
    }catch(e){}
    try{ sessionStorage.setItem("lastActionType","signup"); }catch(e){}
    window.location.href = "sign-up-thanks.html";
  });
})();


/* ---- standard thank-you renderer ---- */
(function(){
  const body=document.body;
  if(!body || !body.dataset.thankyouContext) return;

  const context=body.dataset.thankyouContext;
  const areaNames={"town-centre":"Bloggs Town Centre","north-bloggs":"North Bloggs","little-bloggs":"Little Bloggs","villages":"The Villages"};
  let area="";
  try{area=sessionStorage.getItem("joeArea")||""}catch(e){}
  const areaName=areaNames[area]||"Bloggs Town";

  const localData={
    "town-centre":{
      story:["Joe meets traders on Bloggs Town high street","Businesses raise empty units, parking and the cost of investing in the town centre.","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=84"],
      local:["Bloggs Town business roundtable","Monday 21 September · Bloggs Business Centre","events/business-roundtable.html","https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=84"]
    },
    "north-bloggs":{
      story:["Joe presses for more GP appointments in North Bloggs","Residents say access to appointments remains one of their biggest local concerns.","https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=84"],
      local:["North Bloggs residents meeting","Thursday 15 October · Community Centre","events/north-residents-meeting.html","https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=84"]
    },
    "little-bloggs":{
      story:["Joe takes Little Bloggs road concerns to local leaders","Potholes, congestion and junction safety top the agenda after resident feedback.","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"],
      local:["Public meeting on local transport","Thursday 8 October · Community Hall","events/transport-meeting.html","https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=84"]
    },
    "villages":{
      story:["Protecting community services across the villages","Joe meets residents to discuss transport, local facilities and access to essential services.","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=84"],
      local:["Village services forum","Wednesday 21 October · Village Hall","events/village-services-forum.html","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=84"]
    }
  }[area] || {
    story:["Latest from Joe","See Joe’s latest work across Bloggs Town.","https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=900&q=84"],
    local:["See what’s happening near you","Find local events, campaigns and updates.","your-area.html","https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=84"]
  };

  function setText(id,val){const e=document.getElementById(id);if(e)e.textContent=val}
  function setHref(id,val){const e=document.getElementById(id);if(e)e.href=val}
  function setImage(id,val){const e=document.getElementById(id);if(e)e.style.backgroundImage='url("'+val+'")'}

  setText("thankyouStoryTitle",localData.story[0]);
  setText("thankyouStoryText",localData.story[1]);
  setImage("thankyouStoryImage",localData.story[2]);

  setText("thankyouLocalTitle",localData.local[0]);
  setText("thankyouLocalText",localData.local[1]);
  setHref("thankyouLocalLink",localData.local[2]);
  setImage("thankyouLocalImage",localData.local[3]);

  if(area){
    setText("thankyouLocalText",localData.local[1]+" Selected because you’re in "+areaName+".");
  }

  let next={
    eyebrow:"Next step",
    title:"Tell Joe what should come next",
    text:"Take a short residents survey and help shape Joe’s local priorities.",
    href:"have-your-say.html",
    image:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=84"
  };

  if(context==="campaign"){
    let issue="general";
    try{issue=sessionStorage.getItem("lastCampaignIssue")||"general"}catch(e){}
    next={
      eyebrow:"Keep the momentum going",
      title:"Tell Joe why this issue matters",
      text:"A short answer helps Joe understand what residents want him to focus on next.",
      href:"../have-your-say.html?issue="+encodeURIComponent(issue),
      image:"https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=84"
    };
    setText("thankyouHeading","Thanks for backing the campaign.");
    setText("thankyouSummary",area ? "Joe will keep you updated on this campaign and what it means for "+areaName+"." : "Joe will keep you updated as this campaign develops.");
  } else if(context==="event"){
    next={
      eyebrow:"Another useful action",
      title:"What should Joe ask about at the event?",
      text:"Tell Joe what you most want him to raise or focus on.",
      href:"../have-your-say.html",
      image:"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=84"
    };
    setText("thankyouHeading","You’re booked in.");
    let title="",date="",location="";
    try{
      title=sessionStorage.getItem("lastEventTitle")||"";
      date=sessionStorage.getItem("lastEventDate")||"";
      location=sessionStorage.getItem("lastEventLocation")||"";
    }catch(e){}
    setText("thankyouSummary",[title,date,location].filter(Boolean).join(" · ") || "We’ll send you the event details.");
  } else if(context==="survey"){
    let answer="",issue="";
    try{answer=sessionStorage.getItem("contextAnswer")||"";issue=sessionStorage.getItem("contextIssue")||""}catch(e){}
    next={
      eyebrow:"Related campaign",
      title:"See what Joe is doing on this",
      text:"Your answer can lead straight into the relevant local campaign.",
      href: issue==="transport" ? "campaigns/roads.html" : issue==="health" ? "campaigns/gp.html" : "campaigns.html",
      image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=84"
    };
    setText("thankyouHeading","Thanks for having your say.");
    setText("thankyouSummary",answer ? "You told Joe: “"+answer+"”. He can now compare that with what other residents are saying." : "Joe can now compare your response with what other residents are saying.");
  } else if(context==="signup"){
    next={
      eyebrow:"Choose your updates",
      title:"Fine-tune what you receive",
      text:"You can change your local, campaign, event and monthly update preferences at any time.",
      href:"preferences.html",
      image:"https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=84"
    };
    setText("thankyouHeading","You’re signed up.");
    setText("thankyouSummary",area ? "We’ll keep your updates relevant to "+areaName+" and the choices you made." : "We’ll keep your updates relevant to the choices you made.");
  } else if(context==="donation"){
    next={
      eyebrow:"Stay connected",
      title:"Choose the updates you want",
      text:"If you’d like, you can choose which local and campaign updates you receive.",
      href:"preferences.html",
      image:"https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=900&q=84"
    };
    setText("thankyouHeading","Thank you for your support.");
    setText("thankyouSummary","Your support helps Joe campaign, communicate with residents and organise locally.");
  }

  setText("thankyouNextEyebrow",next.eyebrow);
  setText("thankyouNextTitle",next.title);
  setText("thankyouNextText",next.text);
  setHref("thankyouNextLink",next.href);
  setImage("thankyouNextImage",next.image);

  if(area){
    const href=document.getElementById("thankyouLocalLink");
    if(href){
      const u=new URL(href.getAttribute("href"),window.location.href);
      u.searchParams.set("area",area);
      href.setAttribute("href",u.pathname.split("/").slice(-2).join("/")+u.search);
    }
  }

  const email=document.getElementById("thankyouShareEmail");
  if(email){
    email.href="mailto:?subject="+encodeURIComponent("Thought you might be interested in this")+"&body="+encodeURIComponent(window.location.href);
  }
  const copy=document.querySelector('[data-share="copy"]');
  if(copy){
    copy.addEventListener("click",function(){
      navigator.clipboard?.writeText(window.location.href);
      copy.textContent="Link copied";
    });
  }
})();

/* ---- survey thank-you redirect ---- */
(function(){
  if(document.body.dataset.thankyouContext) return;
  const section=document.getElementById("surveyVolunteerSection");
  if(!section) return;
  document.querySelectorAll("form").forEach(function(form){
    form.addEventListener("submit",function(){
      setTimeout(function(){
        try{sessionStorage.setItem("lastActionType","survey")}catch(e){}
        window.location.href="survey-thanks.html";
      },450);
    });
  });
})();
