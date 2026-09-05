import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:4330';
const label=process.argv[3]||'before';
const dir=`qa/shots/interactions-${label}`;
await mkdir(dir,{recursive:true});
const browser=await chromium.launch();
const ctx=await browser.newContext({viewport:{width:390,height:844}});
const p=await ctx.newPage();
const results={};
await p.goto(base+'/es/cotizacion',{waitUntil:'networkidle'});
await p.locator('#service').selectOption('other');
await p.locator('#description').fill('Renovar la cocina y los gabinetes existentes');
await p.getByText('Añadir detalles del proyecto', {exact:true}).click();
await p.locator('#source').selectOption({label:'Recomendación'});
await p.getByRole('button',{name:'Continuar',exact:true}).click();
await p.waitForTimeout(600);
results.step2=await p.evaluate(()=>({focused:document.activeElement.id,scroll:scrollY,nameTop:document.getElementById('name').getBoundingClientRect().top}));
await p.screenshot({path:`${dir}/quote-step2.png`});
await p.locator('#name').fill('Cliente de prueba');
await p.locator('#phone').fill('8325550100');
await p.locator('#email').fill('cliente@example.com');
await p.locator('#consent').check();
await p.getByRole('button',{name:/Enviar por WhatsApp|Send by WhatsApp/}).click();
await p.waitForTimeout(300);
results.channelError=await p.evaluate(()=>({focused:document.activeElement.id||document.activeElement.name,invalid:document.querySelector('[role="radiogroup"]')?.getAttribute('aria-invalid')}));
await p.getByRole('button',{name:/Cambiar idioma|Change language/}).click();
await p.getByRole('listbox').getByRole('option').last().click();
await p.waitForURL('**/en/quote');
await p.waitForTimeout(500);
await p.getByRole('button',{name:'Back',exact:true}).click();
results.source=await p.locator('#source').evaluate(e=>({value:e.value,text:e.selectedOptions[0]?.textContent}));
const trigger=p.locator('header button[aria-haspopup="listbox"]');
await trigger.click();
results.openFocus=await p.evaluate(()=>document.activeElement.getAttribute('role'));
await p.keyboard.press('ArrowDown');
results.arrowFocus=await p.evaluate(()=>({role:document.activeElement.getAttribute('role'),text:document.activeElement.textContent}));
await p.keyboard.press('Escape');
results.escape=await trigger.getAttribute('aria-expanded');
await p.goto(base+'/es/proyectos',{waitUntil:'networkidle'});
await p.setViewportSize({width:768,height:900});
await p.reload({waitUntil:'networkidle'});
await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
await p.screenshot({path:`${dir}/projects-768.png`,fullPage:true});
results.images=await p.locator('main img').evaluateAll(es=>es.slice(0,3).map(e=>({loaded:e.complete&&e.naturalWidth>0,src:e.currentSrc,style:e.getAttribute('style')})));
results.assets=[];
for(const path of ['/icon.svg','/apple-icon.png','/og/home.jpg','/og/quote.jpg','/robots.txt','/sitemap.xml','/es/privacidad']){
 const res=await ctx.request.get(base+path);results.assets.push({path,status:res.status()});
}
await writeFile(`${dir}/report.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await browser.close();
if(label==='after'){
  const checks={
    'Contact step remains in view':results.step2.nameTop>=80&&results.step2.nameTop<600&&results.step2.focused==='quote-stage',
    'Channel error focuses radio':results.channelError.focused==='channel'&&results.channelError.invalid==='true',
    'Source survives language switch':results.source.value==='Referral'&&results.source.text==='Referral',
    'Listbox opens with focus':results.openFocus==='option',
    'Arrow keys move through options':results.arrowFocus.role==='option'&&results.arrowFocus.text==='Español',
    'Escape closes listbox':results.escape==='false',
  };
  console.log(checks);
  if(Object.values(checks).includes(false))process.exitCode=1;
}
