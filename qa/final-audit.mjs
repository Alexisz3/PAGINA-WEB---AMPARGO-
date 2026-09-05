import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Read-only browsing; no form submissions or external contact requests.
const base = process.argv[2] || 'http://127.0.0.1:3000';
const label = process.argv[3] || 'final-before';
const out = `qa/shots/${label}`;
const routes = ['/es','/en','/es/servicios','/en/services','/es/proyectos','/en/projects','/es/proceso','/en/process','/es/nosotros','/en/about','/es/contacto','/en/contact','/es/cotizacion','/en/quote'];
const widths = process.argv[4] ? process.argv[4].split(',').map(Number) : [390,430,768,1024,1280,1440,1920];
await mkdir(out,{recursive:true});
const browser = await chromium.launch();
const ctx = await browser.newContext({deviceScaleFactor:1});
let errors = [], failedResources = [];
const report = {base, date:new Date().toISOString(),results:[],links:[]};
const urls = new Set();
for(const route of routes){
  for(const width of widths){
    errors=[];failedResources=[];
    // A fresh document also avoids headless cached-image paint artifacts on resize.
    const page = await ctx.newPage();
    page.on('pageerror', e=>errors.push(String(e)));
    page.on('console', m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('response', r=>{if(r.status()>=400)failedResources.push({url:r.url(),status:r.status()});});
    await page.setViewportSize({width,height:width<768?844:900});
    const response = await page.goto(base+route,{waitUntil:'networkidle',timeout:45000});
    await page.evaluate(async()=>{
      document.documentElement.style.scrollBehavior='auto';
      for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}
      await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
      await document.fonts.ready;
      scrollTo(0,0);
    });
    await page.waitForTimeout(900);
    const data = await page.evaluate(()=>{
      const shown = el=>!!el.getClientRects().length && getComputedStyle(el).visibility!=='hidden';
      const clipped=[];
      for(const el of document.querySelectorAll('main h1, main h2, main h3, main p, main dt, main dd')){
        if(!shown(el))continue;
        const r=el.getBoundingClientRect();
        for(let a=el.parentElement;a && a!==document.body;a=a.parentElement){
          const s=getComputedStyle(a),ar=a.getBoundingClientRect();
          if(['auto','scroll'].includes(s.overflowX))break;
          if(['hidden','clip'].includes(s.overflowX) && (r.right>ar.right+2 || r.left<ar.left-2)){
            clipped.push({text:el.textContent.trim().slice(0,100),width:Math.round(r.width),clipWidth:Math.round(ar.width)});break;
          }
        }
      }
      const links=[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
      return {title:document.title,lang:document.documentElement.lang,
        canonical:document.querySelector('link[rel="canonical"]')?.href,
        robots:document.querySelector('meta[name="robots"]')?.content,
        description:document.querySelector('meta[name="description"]')?.content,
        og:[...document.querySelectorAll('meta[property^="og:"]')].map(m=>[m.getAttribute('property'),m.content]),
        h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),
        overflow:document.documentElement.scrollWidth-innerWidth,height:document.documentElement.scrollHeight,
        clipped,links,
        images:[...document.images].filter(shown).map(i=>({src:i.currentSrc,alt:i.getAttribute('alt'),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,rendered:Math.round(i.getBoundingClientRect().width)})),
        fields:[...document.querySelectorAll('main input, main textarea, main select')].map(e=>({id:e.id,type:e.type,required:e.required,ariaRequired:e.getAttribute('aria-required'),fontSize:getComputedStyle(e).fontSize,label:[...e.labels||[]].map(l=>l.textContent.trim()).join(' ')}))};
    });
    for(const href of data.links)if(href?.startsWith('/')&&!href.startsWith('//'))urls.add(href.split('#')[0]);
    const name=route.slice(1).replaceAll('/','-');
    const file=`${out}/${name}-${width}.png`;
    await page.screenshot({path:file,fullPage:true,animations:'disabled'});
    // Readable crops: avoid compressing a 6000px mobile page into one thumbnail.
    if(width===390 || width===1440){
      const meta=await sharp(file).metadata();
      for(let y=0,part=0;y<meta.height;y+=1500,part++){
        await sharp(file).extract({left:0,top:y,width:meta.width,height:Math.min(1500,meta.height-y)}).png().toFile(`${out}/${name}-${width}-part${part}.png`);
      }
    }
    report.results.push({route,width,status:response.status(),errors:[...errors],failedResources:[...failedResources],...data});
    await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
    console.log(`${route} ${width}: clipped=${data.clipped.length}, overflow=${data.overflow}, errors=${errors.length}`);
    await page.close();
  }
}
for(const path of urls){
  const r=await ctx.request.get(base+path,{timeout:30000});
  report.links.push({path,status:r.status()});
}
await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
await browser.close();
console.log(`DONE ${report.results.length} views; ${report.links.length} internal links`);
