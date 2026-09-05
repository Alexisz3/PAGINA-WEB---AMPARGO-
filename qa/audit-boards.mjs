import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
const dir=process.argv[2]||'qa/shots/final-before';
const report=JSON.parse(await readFile(`${dir}/report.json`,'utf8'));
for(const locale of ['es','en'])for(const width of [390,430,768,1024,1280,1440,1920]){
  const rows=report.results.filter(r=>r.route.startsWith('/'+locale)&&r.width===width);
  const tiles=[];
  for(let i=0;i<rows.length;i++){
    const path=`${dir}/${rows[i].route.slice(1).replaceAll('/','-')}-${width}.png`;
    const buf=await sharp(path).resize({width:250,height:2200,fit:'inside'}).toBuffer();
    tiles.push({input:buf,left:i*254,top:26});
    const text=`${rows[i].route} (${width})`;
    tiles.push({input:Buffer.from(`<svg width="250" height="24"><rect width="250" height="24" fill="white"/><text x="4" y="17" font-size="12">${text}</text></svg>`),left:i*254,top:0});
  }
  await sharp({create:{width:rows.length*254,height:2230,channels:3,background:'#777'}}).composite(tiles).png().toFile(`${dir}/board-${locale}-${width}.png`);
}
