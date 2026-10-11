(()=>{'use strict';
const root=document.getElementById('wsSearchPanel');
if(!root)return;
const input=document.getElementById('wsQuickSearch');
const destinations={
 youtube:{home:'https://www.youtube.com/',search:'https://www.youtube.com/results?search_query='},
 twitch:{home:'https://www.twitch.tv/',search:'https://www.twitch.tv/search?term='},
 google:{home:'https://www.google.com/',search:'https://www.google.com/search?q='}
};
function openSearch(engine){
 const destination=destinations[engine];
 if(!destination)return;
 const term=input.value.trim();
 const url=term?destination.search+encodeURIComponent(term):destination.home;
 const tab=window.open(url,'_blank','noopener,noreferrer');
 if(!tab){window.location.href=url;}
}
root.querySelectorAll('[data-search-engine]').forEach(btn=>btn.addEventListener('click',()=>openSearch(btn.dataset.searchEngine)));
input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();openSearch('google')}});
})();