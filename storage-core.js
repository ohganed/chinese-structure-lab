(function(){
  'use strict';
  var ROOT_KEY='csl_profile_v1';
  var CURRENT_SCHEMA=1;
  var LEGACY_KEYS=['csl_ui_language','csl_large_text','csl_encounters','csl_unclear','csl_scene_index','csl_sessions','csl_path_last_day'];

  function safeParse(v,fallback){try{return v==null?fallback:JSON.parse(v);}catch(e){return fallback;}}
  function clone(x){return safeParse(JSON.stringify(x),x);}
  function now(){return new Date().toISOString();}

  function snapshotLegacy(){
    var snap={createdAt:now(),keys:{}};
    LEGACY_KEYS.forEach(function(k){var v=localStorage.getItem(k);if(v!==null)snap.keys[k]=v;});
    if(Object.keys(snap.keys).length){
      var list=safeParse(localStorage.getItem('csl_migration_backups_v1'),[]);
      list.unshift(snap); list=list.slice(0,3);
      localStorage.setItem('csl_migration_backups_v1',JSON.stringify(list));
    }
  }

  function emptyProfile(){return {
    schemaVersion:CURRENT_SCHEMA,
    createdAt:now(),
    updatedAt:now(),
    preferences:{language:'en',largeText:false},
    progress:{sceneIndex:0,pathLastDay:null},
    learning:{sentences:{},sessions:[],events:[]},
    aliases:{sentenceTextToId:{}},
    extensions:{}
  };}

  function legacySentenceId(text){return 'legacy:'+text;}

  function migrateLegacyInto(profile){
    var changed=false;
    var lang=localStorage.getItem('csl_ui_language');
    if(lang){profile.preferences.language=lang;changed=true;}
    var large=localStorage.getItem('csl_large_text');
    if(large!==null){profile.preferences.largeText=large==='1';changed=true;}
    var scene=localStorage.getItem('csl_scene_index');
    if(scene!==null&&!isNaN(parseInt(scene,10))){profile.progress.sceneIndex=parseInt(scene,10);changed=true;}
    var day=localStorage.getItem('csl_path_last_day');
    if(day!==null){profile.progress.pathLastDay=day;changed=true;}

    var encounters=safeParse(localStorage.getItem('csl_encounters'),{});
    var unclear=safeParse(localStorage.getItem('csl_unclear'),{});
    Object.keys(encounters||{}).forEach(function(text){
      var id=profile.aliases.sentenceTextToId[text]||legacySentenceId(text);
      profile.aliases.sentenceTextToId[text]=id;
      profile.learning.sentences[id]=profile.learning.sentences[id]||{id:id,legacyText:text,encounters:0,fuzzy:false,firstSeenAt:null,lastSeenAt:null,extras:{}};
      profile.learning.sentences[id].encounters=Math.max(profile.learning.sentences[id].encounters||0,Number(encounters[text])||0);
      changed=true;
    });
    Object.keys(unclear||{}).forEach(function(text){
      var id=profile.aliases.sentenceTextToId[text]||legacySentenceId(text);
      profile.aliases.sentenceTextToId[text]=id;
      profile.learning.sentences[id]=profile.learning.sentences[id]||{id:id,legacyText:text,encounters:0,fuzzy:false,firstSeenAt:null,lastSeenAt:null,extras:{}};
      profile.learning.sentences[id].fuzzy=!!unclear[text];
      changed=true;
    });
    var sessions=safeParse(localStorage.getItem('csl_sessions'),[]);
    if(Array.isArray(sessions)&&sessions.length){
      var existing=profile.learning.sessions||[];
      if(!existing.length){profile.learning.sessions=clone(sessions);changed=true;}
    }
    return changed;
  }

  function preserveShape(p){
    var base=emptyProfile();
    p=p&&typeof p==='object'?p:{};
    base.schemaVersion=Number(p.schemaVersion)||1;
    base.createdAt=p.createdAt||base.createdAt;
    base.updatedAt=p.updatedAt||base.updatedAt;
    base.preferences=Object.assign(base.preferences,p.preferences||{});
    base.progress=Object.assign(base.progress,p.progress||{});
    base.learning=Object.assign(base.learning,p.learning||{});
    base.learning.sentences=Object.assign({},(p.learning&&p.learning.sentences)||{});
    base.learning.sessions=Array.isArray(base.learning.sessions)?base.learning.sessions:[];
    base.learning.events=Array.isArray(base.learning.events)?base.learning.events:[];
    base.aliases=Object.assign(base.aliases,p.aliases||{});
    base.aliases.sentenceTextToId=Object.assign({},(p.aliases&&p.aliases.sentenceTextToId)||{});
    base.extensions=Object.assign({},p.extensions||{});
    Object.keys(p).forEach(function(k){if(!(k in base))base.extensions['legacyRoot:'+k]=p[k];});
    return base;
  }

  function save(p){p.updatedAt=now();localStorage.setItem(ROOT_KEY,JSON.stringify(p));syncLegacy(p);return p;}

  function syncLegacy(p){
    localStorage.setItem('csl_ui_language',p.preferences.language||'en');
    localStorage.setItem('csl_large_text',p.preferences.largeText?'1':'0');
    localStorage.setItem('csl_scene_index',String(p.progress.sceneIndex||0));
    if(p.progress.pathLastDay!=null)localStorage.setItem('csl_path_last_day',String(p.progress.pathLastDay));
    var enc={},unc={};
    Object.keys(p.learning.sentences||{}).forEach(function(id){var s=p.learning.sentences[id];var text=s.legacyText||s.text;if(!text)return;enc[text]=s.encounters||0;if(s.fuzzy)unc[text]=true;});
    localStorage.setItem('csl_encounters',JSON.stringify(enc));
    localStorage.setItem('csl_unclear',JSON.stringify(unc));
    localStorage.setItem('csl_sessions',JSON.stringify(p.learning.sessions||[]));
  }

  function load(){
    var raw=localStorage.getItem(ROOT_KEY),p;
    if(!raw){snapshotLegacy();p=emptyProfile();migrateLegacyInto(p);return save(p);}
    p=preserveShape(safeParse(raw,{}));
    migrateLegacyInto(p);
    return save(p);
  }

  function resolveSentenceId(text,preferredId){
    var p=load();
    if(preferredId){
      if(text)p.aliases.sentenceTextToId[text]=preferredId;
      if(text){var legacyId=legacySentenceId(text);if(p.learning.sentences[legacyId]&&!p.learning.sentences[preferredId]){p.learning.sentences[preferredId]=p.learning.sentences[legacyId];p.learning.sentences[preferredId].id=preferredId;}}
      save(p);return preferredId;
    }
    if(text&&p.aliases.sentenceTextToId[text])return p.aliases.sentenceTextToId[text];
    var id=legacySentenceId(text||'');if(text){p.aliases.sentenceTextToId[text]=id;save(p);}return id;
  }

  function patchSentence(text,patch,preferredId){
    var p=load(),id=resolveSentenceId(text,preferredId);p=load();
    var old=p.learning.sentences[id]||{id:id,legacyText:text,encounters:0,fuzzy:false,firstSeenAt:null,lastSeenAt:null,extras:{}};
    var next=Object.assign({},old,patch||{});next.extras=Object.assign({},old.extras||{},(patch&&patch.extras)||{});if(text&&!next.legacyText)next.legacyText=text;
    p.learning.sentences[id]=next;save(p);return clone(next);
  }

  function addEvent(type,data){var p=load();p.learning.events.push({id:'ev:'+Date.now()+':'+Math.random().toString(36).slice(2,8),type:type,at:now(),data:clone(data||{})});if(p.learning.events.length>5000)p.learning.events=p.learning.events.slice(-5000);save(p);}
  function addSession(session){var p=load();p.learning.sessions.push(Object.assign({id:'session:'+Date.now(),savedAt:now()},clone(session||{})));save(p);}
  function setPreference(key,value){var p=load();p.preferences[key]=value;save(p);}
  function setProgress(key,value){var p=load();p.progress[key]=value;save(p);}
  function exportData(){return JSON.stringify({format:'ChineseStructureLabBackup',exportedAt:now(),profile:load(),legacyBackups:safeParse(localStorage.getItem('csl_migration_backups_v1'),[])},null,2);}

  window.CSLStorage={schemaVersion:CURRENT_SCHEMA,load:load,save:save,resolveSentenceId:resolveSentenceId,patchSentence:patchSentence,addEvent:addEvent,addSession:addSession,setPreference:setPreference,setProgress:setProgress,exportData:exportData};
  load();
})();
