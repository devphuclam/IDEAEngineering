import fs from 'node:fs';
import path from 'node:path';
import {assertHumanDocument,stableJSON} from './contract.mjs';

const output='apps/server/src/main/resources/dev-access/openapi.json';
const methods=new Set(['get','post','put','patch','delete','head','options','trace']);

function group(route,surface){
  if(surface==='gateway')return 'Gateway';
  if(route.startsWith('/health'))return 'System';
  if(route.startsWith('/api/v1/identity/accounts')||route==='/api/v1/identity/credentials'
    ||route.startsWith('/api/v1/administration/accounts'))return 'Accounts';
  if(route.startsWith('/api/v1/identity/')||route==='/api/v1/administration/context')return 'Identity / Session';
  if(/\/(?:projects|groups|project-memberships|group-memberships)(?:\/|$)/.test(route))return 'Projects / Groups';
  if(/\/(?:roles|permissions)(?:\/|$)/.test(route))return 'Roles';
  if(/\/assignments(?:\/|$)/.test(route))return 'Assignments';
  if(/\/(?:access-inspections|history|operations)(?:\/|$)/.test(route))return 'Access';
  return 'Other';
}

// A generated view, not another contract. Namespace Gateway references so future
// same-named models cannot replace a Server schema by accident.
function gatewayNames(value){
  if(Array.isArray(value))return value.map(gatewayNames);
  if(!value||typeof value!=='object')return value;
  return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,
    key==='$ref'&&typeof item==='string' ? item.replace(/^(#\/components\/[^/]+\/)/,'$1Gateway_')
    : key==='security'&&Array.isArray(item) ? item.map(entry=>Object.fromEntries(Object.entries(entry).map(([name,scopes])=>['Gateway_'+name,scopes])))
    : gatewayNames(item)]));
}

export function swaggerDocument(packet){
  const server=packet.documents.find(entry=>entry.surface.id==='server').document;
  const doc=structuredClone(server);
  doc.info.title='IDEA · API Contract';
  doc.info.description='API đã có trong Server và Gateway. Các mục DESIGN chưa có wire contract không phải endpoint. Gateway dùng HTTPS/Grant riêng; ở đây chỉ đọc tài liệu.';
  doc.paths={};doc.tags=[];
  const names=new Map(packet.catalog.endpoints.map(entry=>[entry.code,entry.name]));
  for(const {surface,document} of packet.documents){
    if(surface.id==='gateway'){
      doc.components??={};
      for(const [section,entries] of Object.entries(document.components??{})){
        doc.components[section]??={};
        for(const [name,value] of Object.entries(entries)){
          const target='Gateway_'+name;
          if(Object.hasOwn(doc.components[section],target))throw Error('Swagger component collision: '+target);
          doc.components[section][target]=gatewayNames(value);
        }
      }
    }
    for(const [route,item] of Object.entries(document.paths)){
      if(Object.hasOwn(doc.paths,route))throw Error('Swagger route collision: '+route);
      const view=surface.id==='gateway'?gatewayNames(item):structuredClone(item);
      for(const [method,op] of Object.entries(view)){
        if(!methods.has(method))continue;
        const contract=op['x-idea-contract'],tag=group(route,surface.id);
        if(!doc.tags.some(entry=>entry.name===tag))doc.tags.push({name:tag});
        op.tags=[tag];op['x-idea-surface']=surface.id;
        op.summary=names.get(contract.code)||op.summary;
        const lines=[op.description];
        if(contract.state!==op.description&&contract.state!==op.summary)lines.push(contract.state);
        for(const [field,label] of [['authority','Thẩm quyền'],['atomicity','Giao dịch'],['concurrency','Đồng thời'],['retry','Retry']])
          lines.push('**'+label+':** '+contract[field]);
        if(surface.id==='gateway'){
          op['x-idea-documentation-only']=true;
          op.security=gatewayNames({security:item[method].security??document.security??[]}).security;
          lines.unshift('Client → Gateway trực tiếp qua HTTPS và signed Grant; không gọi đường dẫn này trên Server. Try it out tắt để không nhập hoặc hiển thị Grant trong console.');
        }
        op.description=lines.filter(Boolean).join('\n\n');
      }
      doc.paths[route]=view;
    }
  }
  assertHumanDocument(doc);
  return doc;
}

export function swaggerText(packet){return stableJSON(swaggerDocument(packet));}
export function checkSwagger(packet){
  const file=path.join(packet.root,output);
  return fs.existsSync(file)&&fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')===swaggerText(packet)
    ? [] : ['STALE_SWAGGER_DOCUMENT: run the reviewed source update'];
}
export function updateSwagger(packet){
  const file=path.join(packet.root,output),text=swaggerText(packet);
  if(!fs.existsSync(file)||fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')!==text){
    fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file+'.tmp',text);fs.renameSync(file+'.tmp',file);
  }
}
