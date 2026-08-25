
(function(){
  const AREAS = {
    "town-centre": {
      name: "Bloggs Town Centre",
      priority: "high street and town centre",
      healthPhrase: "in Bloggs Town Centre",
      roadsPhrase: "around the town centre",
      crimePhrase: "in the town centre",
      businessPhrase: "on Bloggs Town high street",
      servicesPhrase: "in the town centre",
      storyTitle: "Joe backs a new plan for Bloggs Town high street",
      storyText: "Joe is working with traders and residents on empty units, access and the future of the town centre.",
      storyImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=85"
    },
    "north-bloggs": {
      name: "North Bloggs",
      priority: "healthcare and safer streets",
      healthPhrase: "in North Bloggs",
      roadsPhrase: "around North Bloggs",
      crimePhrase: "in North Bloggs",
      businessPhrase: "in North Bloggs",
      servicesPhrase: "across North Bloggs",
      storyTitle: "Joe presses for more GP appointments in North Bloggs",
      storyText: "Residents have raised access to appointments as a major concern, and Joe is pressing local health leaders for action.",
      storyImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"
    },
    "little-bloggs": {
      name: "Little Bloggs",
      priority: "roads and local transport",
      healthPhrase: "in Little Bloggs",
      roadsPhrase: "around Little Bloggs",
      crimePhrase: "in Little Bloggs",
      businessPhrase: "in Little Bloggs",
      servicesPhrase: "in Little Bloggs",
      storyTitle: "Joe takes Little Bloggs transport concerns to local leaders",
      storyText: "Joe has been meeting residents about congestion, road conditions and the reliability of local transport.",
      storyImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
    },
    "villages": {
      name: "The Villages",
      priority: "protecting local services",
      healthPhrase: "across the villages",
      roadsPhrase: "across the villages",
      crimePhrase: "in the villages",
      businessPhrase: "across the villages",
      servicesPhrase: "across the villages",
      storyTitle: "Joe campaigns to protect services in the villages",
      storyText: "Joe is working with rural communities on transport, local facilities and access to essential services.",
      storyImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
    }
  };


  function captureSourceContext(){
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","source","issue"];
    const captured = {};
    keys.forEach(function(key){
      const value = params.get(key);
      if(value) captured[key] = value;
    });
    if(Object.keys(captured).length){
      try{
        const existing = JSON.parse(sessionStorage.getItem("joeSourceContext") || "{}");
        sessionStorage.setItem("joeSourceContext", JSON.stringify(Object.assign(existing,captured)));
      }catch(e){}
    }
  }

  function sourceContext(){
    try{return JSON.parse(sessionStorage.getItem("joeSourceContext") || "{}")}catch(e){return {}}
  }

  function renderSourceContext(){
    const ctx = sourceContext();
    const source = ctx.utm_source || ctx.source;
    if(!source) return;
    let bar = document.getElementById("sourceContextBar");
    if(!bar){
      bar = document.createElement("div");
      bar.id = "sourceContextBar";
      bar.className = "source-context";
      bar.innerHTML = '<div class="container"></div>';
      const status = document.getElementById("areaStatus");
      if(status) status.insertAdjacentElement("afterend",bar);
    }
    const campaign = ctx.utm_campaign ? " · " + ctx.utm_campaign.replace(/[-_]/g," ") : "";
    const inner = bar.querySelector(".container");
    if(inner) inner.textContent = "You arrived from " + source.replace(/[-_]/g," ") + campaign + ".";
    bar.classList.add("visible");
  }

  function decorateJourneyLinks(){
    const ctx = sourceContext();
    const area = storageGet();
    document.querySelectorAll('a[href]').forEach(function(link){
      const raw = link.getAttribute("href");
      if(!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("http")) return;
      if(!/(campaign|event|have-your-say|preferences|your-area)/.test(raw)) return;
      try{
        const url = new URL(raw, window.location.href);
        if(area && !url.searchParams.get("area")) url.searchParams.set("area", area);
        Object.keys(ctx).forEach(function(key){
          if(!url.searchParams.get(key)) url.searchParams.set(key, ctx[key]);
        });
        link.setAttribute("href", url.pathname.replace(window.location.pathname.replace(/[^/]+$/,""), "") + url.search + url.hash);
      }catch(e){}
    });
  }

  function storageGet(){
    try { return sessionStorage.getItem("joeArea"); } catch(e) { return null; }
  }
  function storageSet(value){
    try { sessionStorage.setItem("joeArea", value); } catch(e) {}
  }
  function storageRemove(){
    try { sessionStorage.removeItem("joeArea"); } catch(e) {}
  }

  function resolveArea(value){
    if(!value) return null;
    const raw = value.trim().toLowerCase();
    if(!raw) return null;

    if(raw.includes("north")) return "north-bloggs";
    if(raw.includes("little")) return "little-bloggs";
    if(raw.includes("village")) return "villages";
    if(raw.includes("centre") || raw.includes("center") || raw.includes("town")) return "town-centre";

    const compact = raw.replace(/\s+/g,"").toUpperCase();
    if(compact.startsWith("BG1")) return "town-centre";
    if(compact.startsWith("BG2")) return "north-bloggs";
    if(compact.startsWith("BG3")) return "little-bloggs";
    if(compact.startsWith("BG4")) return "villages";

    return null;
  }

  function pagePersonalisation(areaKey){
    const area = AREAS[areaKey];
    if(!area) return;

    const pageRules = {
      "campaigns.html": {
        heroTitle: "Campaigns for " + area.name,
        heroText: "Local campaigns Joe is working on with residents in " + area.name + " to get practical change.",
        sectionTitle: "Campaigns in " + area.name
      },
      "events.html": {
        heroTitle: "Events in " + area.name,
        heroText: "Meet Joe, join a local event or find what is happening near you in " + area.name + ".",
        sectionTitle: "Happening in " + area.name
      },
      "news.html": {
        heroTitle: "Latest from " + area.name,
        heroText: "News, local campaigns and Joe’s latest work affecting " + area.name + ".",
        sectionTitle: "Latest from " + area.name
      },
      "priorities.html": {
        heroTitle: "Priorities for " + area.name,
        heroText: "The local issues Joe is focused on in " + area.name + ", shaped by what residents tell him.",
        sectionTitle: "Joe’s priorities for " + area.name
      },
      "your-area.html": {
        heroTitle: "Joe in " + area.name,
        heroText: "See what Joe is doing in " + area.name + " and what local residents are raising with him.",
        sectionTitle: "What Joe is doing in " + area.name
      }
    };

    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const rule = pageRules[file];
    if(rule){
      const heroH1 = document.querySelector(".page-hero h1");
      const heroP = document.querySelector(".page-hero p");
      const firstSectionH2 = document.querySelector(".section h2");
      if(heroH1) heroH1.textContent = rule.heroTitle;
      if(heroP) heroP.textContent = rule.heroText;
      if(firstSectionH2) firstSectionH2.textContent = rule.sectionTitle;
    }

    document.querySelectorAll("[data-area-copy]").forEach(function(el){
      const template = el.dataset.areaCopy || "";
      el.textContent = template.replace(/\{area\}/g, area.name);
    });

    document.querySelectorAll("[data-personalised-grid] > *").forEach(function(item){
      const itemArea = item.dataset.area || "";
      if(itemArea === areaKey){
        item.classList.add("is-local");
        if(!item.querySelector(".local-badge")){
          const badge = document.createElement("span");
          badge.className = "local-badge";
          badge.textContent = "In " + area.name;
          item.prepend(badge);
        }
      } else {
        item.classList.remove("is-local");
      }
    });
  }


  const HOME_LOCAL = {
    "town-centre":{
      news:["Joe meets traders on Bloggs Town high street","Businesses raise empty units, parking and the cost of investing in the town centre.","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=84"],
      campaign:["Bring empty shops back into use","Practical action on vacant units in Bloggs Town Centre.","campaigns/high-street.html","https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=84"],
      event:["Bloggs Town business roundtable","Monday 21 September · Bloggs Business Centre","events/business-roundtable.html","https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=84"]
    },
    "north-bloggs":{
      news:["Joe presses for more GP appointments in North Bloggs","Residents say access to appointments remains one of their biggest local concerns.","https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=84"],
      campaign:["Safer streets in North Bloggs","Back visible neighbourhood policing and stronger action on antisocial behaviour.","campaigns/safer-streets.html","https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=84"],
      event:["North Bloggs residents meeting","Thursday 15 October · Community Centre","events/north-residents-meeting.html","https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=84"]
    },
    "little-bloggs":{
      news:["Joe takes Little Bloggs road concerns to local leaders","Potholes, congestion and junction safety top the agenda after resident feedback.","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"],
      campaign:["Fix Little Bloggs’ roads","Tell Joe where potholes, congestion and unsafe junctions need action first.","campaigns/roads.html","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"],
      event:["Public meeting on local transport","Thursday 8 October · Community Hall","events/transport-meeting.html","https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=84"]
    },
    "villages":{
      news:["Protecting community services across the villages","Joe meets residents to discuss transport, local facilities and access to essential services.","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=84"],
      campaign:["Protect rural bus links","Support reliable public transport for residents without access to a car.","campaigns/roads.html","https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=900&q=84"],
      event:["Village services forum","Wednesday 21 October · Village Hall","events/village-services-forum.html","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=84"]
    }
  };

  function renderHomeLocal(areaKey){
    const wrap = document.getElementById("homeLocalHub");
    const cfg = HOME_LOCAL[areaKey];
    const area = AREAS[areaKey];
    if(!wrap || !cfg || !area) return;
    wrap.classList.add("visible");
    document.getElementById("homeLocalTitle").textContent = "Your area: " + area.name;
    document.getElementById("homeLocalIntro").textContent = "The latest news, campaign and event selected for " + area.name + ".";
    document.getElementById("homeLocalHubLink").href = "your-area.html?area=" + areaKey;

    document.getElementById("homeLocalNewsImage").style.backgroundImage = 'url("' + cfg.news[2] + '")';
    document.getElementById("homeLocalNewsTitle").textContent = cfg.news[0];
    document.getElementById("homeLocalNewsText").textContent = cfg.news[1];

    document.getElementById("homeLocalCampaignImage").style.backgroundImage = 'url("' + cfg.campaign[3] + '")';
    document.getElementById("homeLocalCampaignTitle").textContent = cfg.campaign[0];
    document.getElementById("homeLocalCampaignText").textContent = cfg.campaign[1];
    document.getElementById("homeLocalCampaignLink").href = cfg.campaign[2] + "?area=" + areaKey;

    document.getElementById("homeLocalEventImage").style.backgroundImage = 'url("' + cfg.event[3] + '")';
    document.getElementById("homeLocalEventTitle").textContent = cfg.event[0];
    document.getElementById("homeLocalEventText").textContent = cfg.event[1];
    document.getElementById("homeLocalEventLink").href = cfg.event[2] + "?area=" + areaKey;
  }

  function setArea(areaKey){
    if(!AREAS[areaKey]) return;
    storageSet(areaKey);
    const url = new URL(window.location.href);
    url.searchParams.set("area", areaKey);

    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if(file === "your-area.html"){
      window.location.href = url.toString();
      return;
    }

    try { history.replaceState({}, "", url); } catch(e) {}
    applyArea(areaKey);
  }

  function clearArea(){
    storageRemove();
    const url = new URL(window.location.href);
    url.searchParams.delete("area");
    try { history.replaceState({}, "", url); } catch(e) {}
    window.location.reload();
  }

  function sortAreaGrid(areaKey){
    document.querySelectorAll("[data-personalised-grid]").forEach(function(grid){
      const items = Array.from(grid.children);
      items
        .sort(function(a,b){
          const aArea = a.dataset.area || "all";
          const bArea = b.dataset.area || "all";
          const aScore = aArea === areaKey ? 0 : (aArea === "all" ? 1 : 2);
          const bScore = bArea === areaKey ? 0 : (bArea === "all" ? 1 : 2);
          return aScore - bScore;
        })
        .forEach(function(item){ grid.appendChild(item); });
    });

    const campaignNote = document.getElementById("campaignLocalNote");
    const eventNote = document.getElementById("eventLocalNote");
    const newsNote = document.getElementById("newsLocalNote");
    if(campaignNote) campaignNote.classList.add("visible");
    if(eventNote) eventNote.classList.add("visible");
    if(newsNote) newsNote.classList.add("visible");
  }

  function applyArea(areaKey){
    const area = AREAS[areaKey];
    if(!area) return;

    document.documentElement.dataset.area = areaKey;

    const status = document.getElementById("areaStatus");
    const statusName = document.getElementById("areaStatusName");
    if(status && statusName){
      statusName.textContent = area.name;
      status.classList.add("visible");
    }

    const localResult = document.getElementById("localResult");
    const localResultTitle = document.getElementById("localResultTitle");
    if(localResult && localResultTitle){
      localResultTitle.textContent = "You’re in " + area.name;
      localResult.classList.add("visible");
    }

    const latestHeading = document.getElementById("latestHeading");
    const latestNote = document.getElementById("latestLocalNote");
    if(latestHeading) latestHeading.textContent = "Latest from " + area.name;
    if(latestNote) latestNote.classList.add("visible");

    const storyTitle = document.getElementById("localStoryTitle");
    const storyText = document.getElementById("localStoryText");
    const storyImage = document.getElementById("localStoryImage");
    if(storyTitle) storyTitle.textContent = area.storyTitle;
    if(storyText) storyText.textContent = area.storyText;
    if(storyImage) storyImage.style.backgroundImage = "url('" + area.storyImage + "')";

    const priorityAreaLine = document.getElementById("priorityAreaLine");
    if(priorityAreaLine){
      priorityAreaLine.textContent = "For " + area.name + ", we’re prioritising local content around " + area.priority + ".";
      priorityAreaLine.classList.add("visible");
    }

    sortAreaGrid(areaKey);
    personaliseContextSurveys(areaKey);
    pagePersonalisation(areaKey);
    renderHomeLocal(areaKey);
  }

  function showInvalid(input){
    if(!input) return;
    const old = input.placeholder;
    input.value = "";
    input.placeholder = "Try BG1, BG2, BG3 or BG4";
    input.focus();
    setTimeout(function(){ input.placeholder = old; }, 2200);
  }

  function personaliseContextSurveys(areaKey){
    const area = AREAS[areaKey];
    if(!area) return;

    document.querySelectorAll("[data-context-survey]").forEach(function(survey){
      const issue = survey.dataset.issue || "";
      const heading = survey.querySelector("h3[data-question-base]");
      if(!heading) return;

      const base = heading.dataset.questionBase || heading.textContent;
      let suffix = "";
      if(issue === "health") suffix = area.healthPhrase;
      else if(issue === "transport") suffix = area.roadsPhrase;
      else if(issue === "crime") suffix = area.crimePhrase;
      else if(issue === "business") suffix = area.businessPhrase;
      else if(issue === "local-services") suffix = area.servicesPhrase;

      if(suffix){
        heading.textContent = base.replace(/\?$/, "") + " " + suffix + "?";
      }

      const intro = survey.querySelector(".context-intro");
      if(intro){
        intro.innerHTML = "One quick question helps Joe understand what residents in <span class=\"personalised-copy\">" + area.name + "</span> are experiencing.";
      }
    });
  }

  function initContextSurveys(){
    document.querySelectorAll("[data-context-survey]").forEach(function(survey){
      const submit = survey.querySelector("[data-submit-context]");
      const result = survey.querySelector("[data-context-result]");
      const resultText = survey.querySelector("[data-context-result-text]");
      if(!submit || !result) return;

      submit.addEventListener("click", function(){
        const selected = survey.querySelector("input[name='context_answer']:checked");
        if(!selected){
          const old = submit.textContent;
          submit.textContent = "Choose an answer first";
          setTimeout(function(){ submit.textContent = old; }, 1600);
          return;
        }

        const areaKey = document.documentElement.dataset.area || storageGet() || "";
        const area = AREAS[areaKey];
        const issue = survey.dataset.issue || "";

        try{
          sessionStorage.setItem("contextIssue", issue);
          sessionStorage.setItem("contextAnswer", selected.value);
          if(areaKey) sessionStorage.setItem("contextArea", areaKey);
        }catch(e){}

        if(resultText){
          resultText.textContent = area
            ? "Joe can now compare this with what other residents in " + area.name + " are saying."
            : "Joe can now compare this with what other residents are saying.";
        }
        result.classList.add("visible");
        submit.textContent = "Answer saved";
        submit.disabled = true;
      });
    });
  }

  captureSourceContext();
  renderSourceContext();

  const params = new URLSearchParams(window.location.search);
  const queryArea = params.get("area");
  const initial = AREAS[queryArea] ? queryArea : storageGet();
  if(initial && AREAS[initial]) applyArea(initial);
  decorateJourneyLinks();
  initContextSurveys();

  const areaButton = document.getElementById("areaButton");
  const areaInput = document.getElementById("areaInput");
  if(areaButton && areaInput){
    areaButton.addEventListener("click", function(){
      const resolved = resolveArea(areaInput.value);
      if(!resolved) return showInvalid(areaInput);
      setArea(resolved);
    });
    areaInput.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        areaButton.click();
      }
    });
  }

  const heroSignup = document.getElementById("heroSignup");
  const heroPostcode = document.getElementById("heroPostcode");
  if(heroSignup && heroPostcode){
    heroSignup.addEventListener("submit", function(e){
      e.preventDefault();
      const resolved = resolveArea(heroPostcode.value);
      if(resolved) setArea(resolved);
      const button = heroSignup.querySelector("button");
      if(button){
        const old = button.textContent;
        button.textContent = "Thanks";
        setTimeout(function(){ button.textContent = old; }, 1800);
      }
    });
  }

  const dismissButton = document.getElementById("dismissAreaButton");
  if(dismissButton){
    dismissButton.addEventListener("click", function(){
      storageRemove();
      try{ sessionStorage.removeItem("lastCampaignArea"); sessionStorage.removeItem("contextArea"); }catch(e){}
      const url = new URL(window.location.href);
      url.searchParams.delete("area");
      window.location.href = url.pathname + (url.search ? url.search : "") + (url.hash || "");
    });
  }

  const changeButton = document.getElementById("changeAreaButton");
  if(changeButton){
    changeButton.addEventListener("click", function(){
      if(document.getElementById("areaInput")){
        storageRemove();
        document.getElementById("areaStatus")?.classList.remove("visible");
        const input = document.getElementById("areaInput");
        input.value = "";
        input.scrollIntoView({behavior:"smooth", block:"center"});
        setTimeout(function(){ input.focus(); }, 350);
      } else {
        clearArea();
      }
    });
  }
})();
