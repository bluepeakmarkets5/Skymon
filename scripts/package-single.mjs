import fs from 'node:fs';
const dir=new URL('../dist/',import.meta.url);let html=fs.readFileSync(new URL('index.html',dir),'utf8');
html=html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/,(_,p)=>'<script type="module">'+fs.readFileSync(new URL(p.replace(/^\.\//,''),dir),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,(_,p)=>'<style>'+fs.readFileSync(new URL(p.replace(/^\.\//,''),dir),'utf8')+'</style>');
html=html.replace(/<link rel="manifest"[^>]*>/,'');
const dest=process.argv[2]||'../Riverwood-Adventure.html';fs.writeFileSync(dest,html);console.log('Created '+dest+' ('+Math.round(Buffer.byteLength(html)/1024)+' KB)');
