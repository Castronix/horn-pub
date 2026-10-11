"use client";
import { useEffect, useMemo, useState } from "react";

type Verse = { book:string; chapter:number; verse:number; text:string; ref:string };
type BookData = { book:string; chapters:{chapter:string;verses:{verse:string;text:string}[]}[] };
const BOOKS = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
const CATEGORIES = [
 {name:"Hope & Promise",sub:"Verses for the days you need hope",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",terms:["hope","promise","comfort"]},
 {name:"Jesus & His Teachings",sub:"Words and works of Christ",image:"https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80",terms:["jesus","christ","love"]},
 {name:"Faith & Trust",sub:"Scripture for an uncertain path",image:"https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=900&q=80",terms:["faith","trust","believe"]},
 {name:"Wisdom & Guidance",sub:"Find direction in the Word",image:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",terms:["wisdom","guide","understanding"]},
 {name:"Prayer & Worship",sub:"Passages for time with God",image:"https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80",terms:["pray","prayer","praise"]},
 {name:"Strength & Courage",sub:"Read when life feels heavy",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",terms:["strength","courage","strong"]},
 {name:"Peace & Rest",sub:"Be still and take a breath",image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",terms:["peace","rest","still"]},
 {name:"The Bible Library",sub:"Browse all 66 books of Scripture",image:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",terms:[]}
];
function todayIndex(){const d=new Date();return (d.getFullYear()*367+d.getMonth()*31+d.getDate())%12;}
export default function Home(){
 const [verses,setVerses]=useState<Verse[]>([]);
 const [loading,setLoading]=useState(true);
 const [loadError,setLoadError]=useState("");
 const [query,setQuery]=useState("");
 const [selected,setSelected]=useState<Verse|null>(null);
 const [bookFilter,setBookFilter]=useState("All books");
 const [activeCategory,setActiveCategory]=useState("");
 const [page,setPage]=useState(1);
 const pageSize=24;
 const [showLibrary,setShowLibrary]=useState(false);
 useEffect(()=>{let live=true; (async()=>{try{
   const results=await Promise.all(BOOKS.map(async book=>{const fileName=book.replace(/\s+/g,"");const url="https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/"+fileName+".json";const response=await fetch(url);if(!response.ok)throw new Error("Could not load "+book);return await response.json() as BookData;}));
   const all:Verse[]=[];for(const data of results){for(const ch of data.chapters||[]){for(const v of ch.verses||[]){all.push({book:data.book,chapter:Number(ch.chapter),verse:Number(v.verse),text:v.text,ref:data.book+" "+ch.chapter+":"+v.verse});}}}
   if(live){setVerses(all);setLoading(false);}
  }catch(e){if(live){setLoadError("The Bible text could not be loaded right now. Please check your connection and try again.");setLoading(false);}}})();return()=>{live=false};},[]);
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return verses.filter(v=>(bookFilter==="All books"||v.book===bookFilter)&&(!q||(v.ref+" "+v.text).toLowerCase().includes(q)));},[verses,query,bookFilter]);
 const daily=verses.length?verses[Math.min(verses.length-1,Math.floor(Date.now()/86400000)%verses.length)]:null;
 const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));
 const displayed=filtered.slice((page-1)*pageSize,page*pageSize);
 const pageNumbers=Array.from(new Set([1,2,3,4,5,10,pageCount,page-1,page,page+1].filter(n=>n>=1&&n<=pageCount))).sort((a,b)=>a-b);
 function openCategory(name:string){setActiveCategory(name);if(name==="The Bible Library"){setShowLibrary(true);setQuery("");setBookFilter("All books");setPage(1);document.getElementById("library")?.scrollIntoView({behavior:"smooth"});return;}const c=CATEGORIES.find(x=>x.name===name);setQuery(c?.terms[0]||"");setBookFilter("All books");setPage(1);document.getElementById("library")?.scrollIntoView({behavior:"smooth"});}
 return <main className="site-shell">
  <header className="container topbar"><a className="brand" href="#" aria-label="HornPub home"><span className="brand-horn">Horn</span><span className="brand-pub">pub</span></a><form className="header-search" onSubmit={e=>{e.preventDefault();document.getElementById("library")?.scrollIntoView({behavior:"smooth"});}}><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the Bible by verse, phrase, or reference" aria-label="Search the Bible"/></form><a className="top-link" href="#library">BIBLE LIBRARY</a></header>
  <nav className="topic-strip" aria-label="Bible navigation"><div className="container topic-strip-inner"><a href="#home">HOME</a><a href="#browse">BIBLE TOPICS</a><a href="#library" onClick={()=>{setShowLibrary(true);setQuery("");}}>ALL 66 BOOKS</a><a href="#daily">VERSE OF THE DAY</a></div></nav>
  <section className="container welcome" id="home"><div><div className="eyebrow">THE BIBLE, READY TO EXPLORE</div><h1>Find the Word.<br/><span>Stay for the truth.</span></h1><p>Browse Scripture by topic, search the full King James Version, or open a passage and read it in context.</p></div><div className="welcome-count"><strong>{loading?"…":verses.length.toLocaleString()}</strong><span>VERSES IN THE LIBRARY</span><small>King James Version · 66 books</small></div></section>
  <section className="container browse-section" id="browse"><div className="section-title"><div><span className="section-kicker">BROWSE BY INTEREST</span><h2>Where do you want to begin?</h2></div><span className="section-aside">Choose a collection to explore</span></div><div className="image-grid">{CATEGORIES.map(c=><button className="image-tile" key={c.name} onClick={()=>openCategory(c.name)}><img src={c.image} alt="" loading="lazy"/><span className="tile-shade"/><span className="tile-copy"><strong>{c.name}</strong><small>{c.sub}</small><em>EXPLORE ↗</em></span></button>)}</div></section>
  <section className="container library-section" id="library"><div className="section-title"><div><span className="section-kicker">SEARCH SCRIPTURE</span><h2>{query? "Search results":"The Bible library"}</h2><p className="library-intro">Every verse is loaded from a structured KJV text source. Select any result to read the full verse and its reference.</p></div><span className="result-count">{loading?"Loading Bible…":filtered.length.toLocaleString()+" verses"}</span></div>
   <div className="library-controls"><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Search words, a phrase, or a reference (e.g. John 3:16)"/><select value={bookFilter} onChange={e=>{setBookFilter(e.target.value);setPage(1);}} aria-label="Filter by book"><option>All books</option>{BOOKS.map(b=><option key={b}>{b}</option>)}</select><button onClick={()=>{setQuery("");setBookFilter("All books");setPage(1);}}>Reset</button></div>
   {loadError&&<div className="load-error"><p>{loadError}</p><button onClick={()=>window.location.reload()}>Try again</button></div>}
   {loading&&!loadError&&<div className="loading-state">Loading all 66 books of the King James Version…</div>}
   {!loading&&!loadError&&<><div className="verse-result-grid">{displayed.map(v=><button className="verse-result" key={v.ref} onClick={()=>setSelected(v)}><span>{v.book.toUpperCase()} · CHAPTER {v.chapter}</span><strong>{v.ref}</strong><p>{v.text}</p><em>READ VERSE ↗</em></button>)}</div>{filtered.length===0&&<p className="loading-state">No exact matches found. Try a shorter phrase or another book.</p>}{pageCount>1&&<nav className="pagination" aria-label="Bible verse pages"><button className="page-button" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>{pageNumbers.map((n,i)=><span className="page-slot" key={n}>{i>0&&n-pageNumbers[i-1]>1&&<span className="page-ellipsis">…</span>}<button className={"page-button "+(page===n?"active":"")} aria-current={page===n?"page":undefined} onClick={()=>setPage(n)}>{n}</button></span>)}<button className="page-button next" disabled={page===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</button></nav>}</>}
  </section>
  {selected&&<div className="verse-modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><article className="verse-modal" role="dialog" aria-modal="true" aria-label={selected.ref} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close">×</button><span className="section-kicker">KING JAMES VERSION</span><h2>{selected.ref}</h2><p className="modal-verse">{selected.text}</p><div className="modal-actions"><button onClick={async()=>{await navigator.clipboard.writeText(selected.text+" — "+selected.ref);}}>Copy verse</button><button onClick={()=>{if(navigator.share)navigator.share({title:selected.ref,text:selected.text+" — "+selected.ref});else navigator.clipboard.writeText(selected.text+" — "+selected.ref);}}>Share verse</button></div><small>Read the surrounding chapter for context.</small></article></div>}
  <footer className="footer"><div className="container footer-inner"><a className="brand" href="#"><span className="brand-horn">Horn</span><span className="brand-pub">pub</span></a><span>Scripture first. Context always.</span><span>King James Version (KJV)</span></div><p className="container footer-note">Bible text source: aruljohn/Bible-kjv, King James Version. KJV public-domain status varies by jurisdiction; this site uses the historic translation. Images are illustrative category artwork, not claims of literal depictions of a particular passage. Each image source and its license should be reviewed before public launch.</p></footer>
 </main>;
}
