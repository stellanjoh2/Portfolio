const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Editor-BB62yR8l.js","assets/editor-DX1uJZi4.js","assets/editor-D1GFrEhl.css","assets/injectFonts-DUjcmtxo.js","assets/index-CzGW6FVa.js"])))=>i.map(i=>d[i]);
import{r as k,j as A,c as Pt}from"./editor-DX1uJZi4.js";import{g as Q}from"./index-CzGW6FVa.js";import{T as Dt,a as Le,b as dt,L as It,c as se,F as pt,M as O,V as N,C as P,d as B,S as ie,e as Ot,P as Ft,D as kt,f as ge,I as Ut,g as L,Q as Te,h as qe,B as Fe,O as mt,i as Bt,j as Ht,k as Me,l as Gt,m as zt,n as gt,N as Vt,o as jt,p as Kt,q as re,r as Tt,R as Ce,s as Wt,t as Xt,u as Qt,v as we,w as qt,x as xt,y as Yt,z as j,A as $t,E as Zt,G as vt,H as Jt,J as es,K as ts,U as ss,W as pe,X as St,Y as Ne,Z as _t,_ as ns,$ as is,a0 as rs,a1 as os,a2 as Mt,a3 as Ye,a4 as $e,a5 as Ze,a6 as Je,a7 as Pe,a8 as as,a9 as ls,aa as wt,ab as cs,ac as et,ad as K,ae as xe,af as q,ag as ne,ah as us,ai as Et,aj as hs,ak as fs,al as ds,am as ps,an as ms,ao as gs,ap as bt,aq as Ts,ar as xs,as as vs,at as Ss,au as _s,av as Ms,aw as ws,ax as Es,ay as bs}from"./OrbitControls-DD8uEuCZ.js";const Rs="modulepreload",As=function(h){return"/"+h},tt={},ys=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let r=function(l){return Promise.all(l.map(c=>Promise.resolve(c).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=r(t.map(l=>{if(l=As(l),l in tt)return;tt[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Rs,c||(f.as="script"),f.crossOrigin="",f.href=l,o&&f.setAttribute("nonce",o),document.head.appendChild(f),c)return new Promise((d,p)=>{f.addEventListener("load",d),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return s.then(r=>{for(const a of r||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})},st="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%20viewBox='0%200%20198%20248.77'%3e%3c!--%20Generator:%20Adobe%20Illustrator%2030.7.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%202.1.4%20Build%20114)%20--%3e%3cdefs%3e%3cstyle%3e%20.st0%20{%20fill:%20%23333;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='st0'%20d='M162.16,72.46l35.84-20.88L117,4.82c-11.14-6.43-24.86-6.43-36,0L18,41.2C6.86,47.63,0,59.51,0,72.37v20.78l99-57.16,63.16,36.47Z'/%3e%3cpath%20class='st0'%20d='M96.21,211.17l-60.38-34.86L0,197.19l81,46.77c11.14,6.43,24.86,6.43,36,0h0s63-36.38,63-36.38c11.14-6.43,18-18.32,18-31.18v-20.78l-96.22,55.55c-1.72.99-3.84.99-5.57,0Z'/%3e%3cpath%20class='st0'%20d='M180,103.65l-35.85-20.7-35.84,20.88,89.69,51.78v-20.78c0-12.86-6.86-24.75-18-31.18Z'/%3e%3cpath%20class='st0'%20d='M18,145.12l35.85,20.7,35.84-20.88L0,93.16v20.78c0,12.86,6.86,24.75,18,31.18Z'/%3e%3c/svg%3e";function nt(h,e){if(e===Dt)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),h;if(e===Le||e===dt){let t=h.getIndex();if(t===null){const i=[],r=h.getAttribute("position");if(r!==void 0){for(let a=0;a<r.count;a++)i.push(a);h.setIndex(i),t=h.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),h}const n=t.count-2,s=[];if(e===Le)for(let i=1;i<=n;i++)s.push(t.getX(0)),s.push(t.getX(i)),s.push(t.getX(i+1));else for(let i=0;i<n;i++)i%2===0?(s.push(t.getX(i)),s.push(t.getX(i+1)),s.push(t.getX(i+2))):(s.push(t.getX(i+2)),s.push(t.getX(i+1)),s.push(t.getX(i)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),h.setIndex(s),h.clearGroups(),h}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),h}function Ls(h){const e=new Map,t=new Map,n=h.clone();return Rt(h,n,function(s,i){e.set(i,s),t.set(s,i)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const i=s,r=e.get(s),a=r.skeleton.bones;i.skeleton=r.skeleton.clone(),i.bindMatrix.copy(r.bindMatrix),i.skeleton.bones=a.map(function(o){return t.get(o)}),i.bind(i.skeleton,i.bindMatrix)}),n}function Rt(h,e,t){t(h,e);for(let n=0;n<h.children.length;n++)Rt(h.children[n],e.children[n],t)}class Cs extends It{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Os(t)}),this.register(function(t){return new Fs(t)}),this.register(function(t){return new ks(t)}),this.register(function(t){return new Ws(t)}),this.register(function(t){return new Xs(t)}),this.register(function(t){return new Qs(t)}),this.register(function(t){return new Bs(t)}),this.register(function(t){return new Hs(t)}),this.register(function(t){return new Gs(t)}),this.register(function(t){return new zs(t)}),this.register(function(t){return new Is(t)}),this.register(function(t){return new Vs(t)}),this.register(function(t){return new Us(t)}),this.register(function(t){return new Ks(t)}),this.register(function(t){return new js(t)}),this.register(function(t){return new Ps(t)}),this.register(function(t){return new it(t,v.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new it(t,v.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new qs(t)})}load(e,t,n,s){const i=this;let r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){const l=se.extractUrlBase(e);r=se.resolveURL(l,this.path)}else r=se.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){s?s(l):console.error(l),i.manager.itemError(e),i.manager.itemEnd(e)},o=new pt(this.manager);o.setPriority(this.priority),o.setCache(this.cache),o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{i.parse(l,r,function(c){t(c),i.manager.itemEnd(e)},a)}catch(c){a(c)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let i;const r={},a={},o=new TextDecoder;if(typeof e=="string")i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===At){try{r[v.KHR_BINARY_GLTF]=new Ys(e)}catch(u){s&&s(u);return}i=JSON.parse(r[v.KHR_BINARY_GLTF].content)}else i=JSON.parse(o.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new un(i,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){const u=this.pluginCallbacks[c](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,r[u.name]=!0}if(i.extensionsUsed)for(let c=0;c<i.extensionsUsed.length;++c){const u=i.extensionsUsed[c],f=i.extensionsRequired||[];switch(u){case v.KHR_MATERIALS_UNLIT:r[u]=new Ds;break;case v.KHR_DRACO_MESH_COMPRESSION:r[u]=new $s(i,this.dracoLoader);break;case v.KHR_TEXTURE_TRANSFORM:r[u]=new Zs;break;case v.KHR_MESH_QUANTIZATION:r[u]=new Js;break;default:f.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(r),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,i){n.parse(e,t,s,i)})}}function Ns(){let h={};return{get:function(e){return h[e]},add:function(e,t){h[e]=t},remove:function(e){delete h[e]},removeAll:function(){h={}}}}function E(h,e,t){const n=h.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const v={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Ps{constructor(e){this.parser=e,this.name=v.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const i=t[n];i.extensions&&i.extensions[this.name]&&i.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,i.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const i=t.json,o=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e];let l;const c=new P(16777215);o.color!==void 0&&c.setRGB(o.color[0],o.color[1],o.color[2],B);const u=o.range!==void 0?o.range:0;switch(o.type){case"directional":l=new kt(c),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Ft(c),l.distance=u;break;case"spot":l=new Ot(c),l.distance=u,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,l.angle=o.spot.outerConeAngle,l.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return l.position.set(0,0,0),U(l,o),o.intensity!==void 0&&(l.intensity=o.intensity),l.name=t.createUniqueName(o.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,i=n.json.nodes[e],a=(i.extensions&&i.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}}class Ds{constructor(){this.name=v.KHR_MATERIALS_UNLIT}getMaterialType(){return j}extendParams(e,t,n){const s=[];e.color=new P(1,1,1),e.opacity=1;const i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){const r=i.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],B),e.opacity=r[3]}i.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",i.baseColorTexture,ie))}return Promise.all(s)}}class Is{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Os{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const i=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new N(i,i)}return Promise.all(s)}}class Fs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(s)}}class ks{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_DISPERSION}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class Us{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class Bs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_SHEEN}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new P(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const i=n.sheenColorFactor;t.sheenColor.setRGB(i[0],i[1],i[2],B)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,ie)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class Hs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class Gs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_VOLUME}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const i=n.attenuationColor||[1,1,1];return t.attenuationColor=new P().setRGB(i[0],i[1],i[2],B),Promise.all(s)}}class zs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_IOR}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class Vs{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_SPECULAR}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const i=n.specularColorFactor||[1,1,1];return t.specularColor=new P().setRGB(i[0],i[1],i[2],B),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,ie)),Promise.all(s)}}class js{constructor(e){this.parser=e,this.name=v.EXT_MATERIALS_BUMP}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class Ks{constructor(e){this.parser=e,this.name=v.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return E(this.parser,e,this.name)!==null?O:null}extendMaterialParams(e,t){const n=E(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class Ws{constructor(e){this.parser=e,this.name=v.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const i=s.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,i.source,r)}}class Xs{constructor(e){this.parser=e,this.name=v.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,i=s.textures[e];if(!i.extensions||!i.extensions[t])return null;const r=i.extensions[t],a=s.images[r.source];let o=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(o=l)}return n.loadTextureImage(e,r.source,o)}}class Qs{constructor(e){this.parser=e,this.name=v.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,i=s.textures[e];if(!i.extensions||!i.extensions[t])return null;const r=i.extensions[t],a=s.images[r.source];let o=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(o=l)}return n.loadTextureImage(e,r.source,o)}}class it{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],i=this.parser.getDependency("buffer",s.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return i.then(function(a){const o=s.byteOffset||0,l=s.byteLength||0,c=s.count,u=s.byteStride,f=new Uint8Array(a,o,l);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(c,u,f,s.mode,s.filter).then(function(d){return d.buffer}):r.ready.then(function(){const d=new ArrayBuffer(c*u);return r.decodeGltfBuffer(new Uint8Array(d),c,u,f,s.mode,s.filter),d})})}else return null}}class qs{constructor(e){this.name=v.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==D.TRIANGLES&&l.mode!==D.TRIANGLE_STRIP&&l.mode!==D.TRIANGLE_FAN&&l.mode!==void 0)return null;const r=n.extensions[this.name].attributes,a=[],o={};for(const l in r)a.push(this.parser.getDependency("accessor",r[l]).then(c=>(o[l]=c,o[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const c=l.pop(),u=c.isGroup?c.children:[c],f=l[0].count,d=[];for(const p of u){const g=new ge,m=new L,T=new Te,x=new L(1,1,1),_=new Ut(p.geometry,p.material,f);for(let w=0;w<f;w++)o.TRANSLATION&&m.fromBufferAttribute(o.TRANSLATION,w),o.ROTATION&&T.fromBufferAttribute(o.ROTATION,w),o.SCALE&&x.fromBufferAttribute(o.SCALE,w),_.setMatrixAt(w,g.compose(m,T,x));let S=null;for(const w in o)if(w==="_COLOR_0"){const C=o[w];_.instanceColor=new qe(C.array,C.itemSize,C.normalized)}else if(w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"){if(S===null){const M=_.geometry;S=new Fe,S.name=M.name;for(const y in M.attributes)S.setAttribute(y,M.attributes[y]);for(const y in M.morphAttributes)S.morphAttributes[y]=M.morphAttributes[y];M.index!==null&&S.setIndex(M.index),S.morphTargetsRelative=M.morphTargetsRelative;for(const y of M.groups)S.addGroup(y.start,y.count,y.materialIndex);M.boundingBox!==null&&(S.boundingBox=M.boundingBox.clone()),M.boundingSphere!==null&&(S.boundingSphere=M.boundingSphere.clone()),S.drawRange.start=M.drawRange.start,S.drawRange.count=M.drawRange.count,S.userData=Object.assign({},M.userData),_.geometry=S}const C=o[w];S.setAttribute(w,new qe(C.array,C.itemSize,C.normalized))}mt.prototype.copy.call(_,p),this.parser.assignFinalMaterial(_),d.push(_)}return c.isGroup?(c.clear(),c.add(...d),c):d[0]}))}}const At="glTF",ee=12,rt={JSON:1313821514,BIN:5130562};class Ys{constructor(e){this.name=v.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ee),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==At)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-ee,i=new DataView(e,ee);let r=0;for(;r<s;){const a=i.getUint32(r,!0);r+=4;const o=i.getUint32(r,!0);if(r+=4,o===rt.JSON){const l=new Uint8Array(e,ee+r,a);this.content=n.decode(l)}else if(o===rt.BIN){const l=ee+r;this.body=e.slice(l,l+a)}r+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class $s{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=v.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,i=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},l={};for(const c in r){const u=De[c]||c.toLowerCase();a[u]=r[c]}for(const c in e.attributes){const u=De[c]||c.toLowerCase();if(r[c]!==void 0){const f=n.accessors[e.attributes[c]],d=Y[f.componentType];l[u]=d.name,o[u]=f.normalized===!0}}return t.getDependency("bufferView",i).then(function(c){return new Promise(function(u,f){s.decodeDracoFile(c,function(d){for(const p in d.attributes){const g=d.attributes[p],m=o[p];m!==void 0&&(g.normalized=m)}u(d)},a,l,B,f)})})}}class Zs{constructor(){this.name=v.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class Js{constructor(){this.name=v.KHR_MESH_QUANTIZATION}}class yt extends ls{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,i=e*s*3+s;for(let r=0;r!==s;r++)t[r]=n[i+r];return t}interpolate_(e,t,n,s){const i=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,l=a*3,c=s-t,u=(n-t)/c,f=u*u,d=f*u,p=e*l,g=p-l,m=-2*d+3*f,T=d-f,x=1-m,_=T-f+u;for(let S=0;S!==a;S++){const w=r[g+S+a],C=r[g+S+o]*c,M=r[p+S+a],y=r[p+S]*c;i[S]=x*w+_*C+m*M+T*y}return i}}const en=new Te;class tn extends yt{interpolate_(e,t,n,s){const i=super.interpolate_(e,t,n,s);return en.fromArray(i).normalize().toArray(i),i}}const D={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Y={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ot={9728:Tt,9729:re,9984:Kt,9985:jt,9986:Vt,9987:gt},at={33071:Xt,33648:Wt,10497:Ce},Ee={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},De={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},G={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},sn={CUBICSPLINE:void 0,LINEAR:Mt,STEP:os},be={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function nn(h){return h.DefaultMaterial===void 0&&(h.DefaultMaterial=new xt({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:as})),h.DefaultMaterial}function V(h,e,t){for(const n in t.extensions)h[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function U(h,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(h.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function rn(h,e,t){let n=!1,s=!1,i=!1;for(let l=0,c=e.length;l<c;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(i=!0),n&&s&&i)break}if(!n&&!s&&!i)return Promise.resolve(h);const r=[],a=[],o=[];for(let l=0,c=e.length;l<c;l++){const u=e[l];if(n){const f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):h.attributes.position;r.push(f)}if(s){const f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):h.attributes.normal;a.push(f)}if(i){const f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):h.attributes.color;o.push(f)}}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o)]).then(function(l){const c=l[0],u=l[1],f=l[2];return n&&(h.morphAttributes.position=c),s&&(h.morphAttributes.normal=u),i&&(h.morphAttributes.color=f),h.morphTargetsRelative=!0,h})}function on(h,e){if(h.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)h.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(h.morphTargetInfluences.length===t.length){h.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)h.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function an(h){let e;const t=h.extensions&&h.extensions[v.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Re(t.attributes):e=h.indices+":"+Re(h.attributes)+":"+h.mode,h.targets!==void 0)for(let n=0,s=h.targets.length;n<s;n++)e+=":"+Re(h.targets[n]);return e}function Re(h){let e="";const t=Object.keys(h).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+h[t[n]]+";";return e}function Ie(h){switch(h){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ln(h){return h.search(/\.jpe?g($|\?)/i)>0||h.search(/^data\:image\/jpeg/)===0?"image/jpeg":h.search(/\.webp($|\?)/i)>0||h.search(/^data\:image\/webp/)===0?"image/webp":h.search(/\.ktx2($|\?)/i)>0||h.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const cn=new ge;class un{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Ns,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,i=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const o=a.match(/Version\/(\d+)/);s=n&&o?parseInt(o[1],10):-1,i=a.indexOf("Firefox")>-1,r=i?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||i&&r<98?(this.textureLoader=new Bt(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new Ht(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new pt(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){const a={scene:r[0][s.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:s.asset,parser:n,userData:{}};return V(i,a,s),U(a,s),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(const o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,i=t.length;s<i;s++){const r=t[s].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let s=0,i=e.length;s<i;s++){const r=e[s];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),i=(r,a)=>{const o=this.associations.get(r);o!=null&&this.associations.set(a,o);for(const[l,c]of r.children.entries())i(c,a.children[l])};return i(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const i=e(t[s]);i&&n.push(i)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(i){return i.loadNode&&i.loadNode(t)});break;case"mesh":s=this._invokeOne(function(i){return i.loadMesh&&i.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(i){return i.loadBufferView&&i.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(i){return i.loadMaterial&&i.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(i){return i.loadTexture&&i.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(i){return i.loadAnimation&&i.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(i){return i!=this&&i.getDependency&&i.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(i,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[v.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(i,r){n.load(se.resolveURL(t.uri,s.path),i,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,i=t.byteOffset||0;return n.slice(i,i+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const r=Ee[s.type],a=Y[s.componentType],o=s.normalized===!0,l=new a(s.count*r);return Promise.resolve(new Me(l,r,o))}const i=[];return s.bufferView!==void 0?i.push(this.getDependency("bufferView",s.bufferView)):i.push(null),s.sparse!==void 0&&(i.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),i.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(i).then(function(r){const a=r[0],o=Ee[s.type],l=Y[s.componentType],c=l.BYTES_PER_ELEMENT,u=c*o,f=s.byteOffset||0,d=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,p=s.normalized===!0;let g,m;if(d&&d!==u){const T=Math.floor(f/d),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+T+":"+s.count;let _=t.cache.get(x);_||(g=new l(a,T*d,s.count*d/c),_=new Gt(g,d/c),t.cache.add(x,_)),m=new zt(_,o,f%d/c,p)}else a===null?g=new l(s.count*o):g=new l(a,f,s.count*o),m=new Me(g,o,p);if(s.sparse!==void 0){const T=Ee.SCALAR,x=Y[s.sparse.indices.componentType],_=s.sparse.indices.byteOffset||0,S=s.sparse.values.byteOffset||0,w=new x(r[1],_,s.sparse.count*T),C=new l(r[2],S,s.sparse.count*o);a!==null&&(m=new Me(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let M=0,y=w.length;M<y;M++){const F=w[M];if(m.setX(F,C[M*o]),o>=2&&m.setY(F,C[M*o+1]),o>=3&&m.setZ(F,C[M*o+2]),o>=4&&m.setW(F,C[M*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){const t=this.json,n=this.options,i=t.textures[e].source,r=t.images[i];let a=this.textureLoader;if(r.uri){const o=n.manager.getHandler(r.uri);o!==null&&(a=o)}return this.loadTextureImage(e,i,a)}loadTextureImage(e,t,n){const s=this,i=this.json,r=i.textures[e],a=i.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];const l=this.loadImageSource(t,n).then(function(c){c.flipY=!1,c.name=r.name||a.name||"",c.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(c.name=a.uri);const f=(i.samplers||{})[r.sampler]||{};return c.magFilter=ot[f.magFilter]||re,c.minFilter=ot[f.minFilter]||gt,c.wrapS=at[f.wrapS]||Ce,c.wrapT=at[f.wrapT]||Ce,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==Tt&&c.minFilter!==re,s.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[o]=l,l}loadImageSource(e,t){const n=this,s=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const r=s.images[e],a=self.URL||self.webkitURL;let o=r.uri||"",l=!1,c;if(t.isKTX2Loader===!0&&r.bufferView!==void 0)c=n.getDependency("bufferView",r.bufferView).then(function(f){return new Promise(function(d,p){t.parse(f,d,p)})});else{if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(f){l=!0;const d=new Blob([f],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");c=Promise.resolve(o).then(function(f){return new Promise(function(d,p){let g=d;t.isImageBitmapLoader===!0&&(g=function(m){const T=new Ye(m);T.needsUpdate=!0,d(T)}),t.load(se.resolveURL(f,i.path),g,void 0,p)})})}const u=c.then(function(f){return l===!0&&a.revokeObjectURL(o),U(f,r),f.userData.mimeType=r.mimeType||ln(r.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),f});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const i=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),i.extensions[v.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[v.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const o=i.associations.get(r);r=i.extensions[v.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),i.associations.set(r,o)}}return s!==void 0&&(r.colorSpace=s),e[t]=r,r})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let o=this.cache.get(a);o||(o=new Qt,we.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o)),n=o}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let o=this.cache.get(a);o||(o=new qt,we.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o)),n=o}if(s||i||r){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),i&&(a+="vertex-colors:"),r&&(a+="flat-shading:");let o=this.cache.get(a);o||(o=n.clone(),i&&(o.vertexColors=!0),r&&(o.flatShading=!0),s&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(a,o),this.associations.set(o,this.associations.get(n))),n=o}e.material=n}getMaterialType(){return xt}loadMaterial(e){const t=this,n=this.json,s=this.extensions,i=n.materials[e];let r;const a={},o=i.extensions||{},l=[];if(o[v.KHR_MATERIALS_UNLIT]){const u=s[v.KHR_MATERIALS_UNLIT];r=u.getMaterialType(),l.push(u.extendParams(a,i,t))}else{const u=i.pbrMetallicRoughness||{};if(a.color=new P(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],B),a.opacity=f[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,ie)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),r=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}i.doubleSided===!0&&(a.side=Yt);const c=i.alphaMode||be.OPAQUE;if(c===be.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,c===be.MASK&&(a.alphaTest=i.alphaCutoff!==void 0?i.alphaCutoff:.5)),i.normalTexture!==void 0&&r!==j&&(l.push(t.assignTexture(a,"normalMap",i.normalTexture)),a.normalScale=new N(1,1),i.normalTexture.scale!==void 0)){const u=i.normalTexture.scale;a.normalScale.set(u,u)}if(i.occlusionTexture!==void 0&&r!==j&&(l.push(t.assignTexture(a,"aoMap",i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&r!==j){const u=i.emissiveFactor;a.emissive=new P().setRGB(u[0],u[1],u[2],B)}return i.emissiveTexture!==void 0&&r!==j&&l.push(t.assignTexture(a,"emissiveMap",i.emissiveTexture,ie)),Promise.all(l).then(function(){const u=new r(a);return i.name&&(u.name=i.name),U(u,i),t.associations.set(u,{materials:e}),i.extensions&&V(s,u,i),u})}createUniqueName(e){const t=$t.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function i(a){return n[v.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return lt(o,a,t)})}const r=[];for(let a=0,o=e.length;a<o;a++){const l=e[a],c=an(l),u=s[c];if(u)r.push(u.promise);else{let f;l.extensions&&l.extensions[v.KHR_DRACO_MESH_COMPRESSION]?f=i(l):f=lt(new Fe,l,t),l.mode===D.TRIANGLE_STRIP?f=f.then(d=>nt(d,dt)):l.mode===D.TRIANGLE_FAN&&(f=f.then(d=>nt(d,Le))),s[c]={primitive:l,promise:f},r.push(f)}}return Promise.all(r)}loadMesh(e){const t=this,n=this.json,s=this.extensions,i=n.meshes[e],r=i.primitives,a=[];for(let o=0,l=r.length;o<l;o++){const c=r[o].material===void 0?nn(this.cache):this.getDependency("material",r[o].material);a.push(c)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){const l=o.slice(0,o.length-1),c=o[o.length-1],u=[];for(let d=0,p=c.length;d<p;d++){const g=c[d],m=r[d];let T;const x=l[d];if(m.mode===D.TRIANGLES||m.mode===D.TRIANGLE_STRIP||m.mode===D.TRIANGLE_FAN||m.mode===void 0){const _=i.isSkinnedMesh===!0,S=g.hasAttribute("skinIndex")&&g.hasAttribute("skinWeight");_&&S===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),T=_&&S?new Zt(g,x):new vt(g,x),T.isSkinnedMesh===!0&&T.normalizeSkinWeights()}else if(m.mode===D.LINES)T=new Jt(g,x);else if(m.mode===D.LINE_STRIP)T=new es(g,x);else if(m.mode===D.LINE_LOOP)T=new ts(g,x);else if(m.mode===D.POINTS)T=new ss(g,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(T.geometry.morphAttributes).length>0&&on(T,i),T.name=t.createUniqueName(i.name||"mesh_"+e),U(T,i),m.extensions&&V(s,T,m),t.assignFinalMaterial(T),u.push(T)}for(let d=0,p=u.length;d<p;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return i.extensions&&V(s,u[0],i),u[0];const f=new pe;i.extensions&&V(s,f,i),t.associations.set(f,{meshes:e});for(let d=0,p=u.length;d<p;d++)f.add(u[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new St(Ne.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new _t(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),U(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,i=t.joints.length;s<i;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const i=s.pop(),r=s,a=[],o=[];for(let l=0,c=r.length;l<c;l++){const u=r[l];if(u){a.push(u);const f=new ge;i!==null&&f.fromArray(i.array,l*16),o.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new ns(a,o)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],i=s.name?s.name:"animation_"+e,r=[],a=[],o=[],l=[],c=[];for(let u=0,f=s.channels.length;u<f;u++){const d=s.channels[u],p=s.samplers[d.sampler],g=d.target,m=g.node,T=s.parameters!==void 0?s.parameters[p.input]:p.input,x=s.parameters!==void 0?s.parameters[p.output]:p.output;g.node!==void 0&&(r.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",T)),o.push(this.getDependency("accessor",x)),l.push(p),c.push(g))}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c)]).then(function(u){const f=u[0],d=u[1],p=u[2],g=u[3],m=u[4],T=[];for(let _=0,S=f.length;_<S;_++){const w=f[_],C=d[_],M=p[_],y=g[_],F=m[_];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const W=n._createAnimationTracks(w,C,M,y,F);if(W)for(let X=0;X<W.length;X++)T.push(W[X])}const x=new is(i,void 0,T);return U(x,s),x})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(i){const r=n._getNodeRef(n.meshCache,s.mesh,i);return s.weights!==void 0&&r.traverse(function(a){if(a.isMesh)for(let o=0,l=s.weights.length;o<l;o++)a.morphTargetInfluences[o]=s.weights[o]}),r})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],i=n._loadNodeShallow(e),r=[],a=s.children||[];for(let l=0,c=a.length;l<c;l++)r.push(n.getDependency("node",a[l]));const o=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([i,Promise.all(r),o]).then(function(l){const c=l[0],u=l[1],f=l[2];f!==null&&c.traverse(function(d){d.isSkinnedMesh&&d.bind(f,cn)});for(let d=0,p=u.length;d<p;d++)c.add(u[d]);if(c.userData.pivot!==void 0&&u.length>0){const d=c.userData.pivot,p=u[0];c.pivot=new L().fromArray(d),c.position.x-=d[0],c.position.y-=d[1],c.position.z-=d[2],p.position.set(0,0,0),delete c.userData.pivot}return c})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const i=t.nodes[e],r=i.name?s.createUniqueName(i.name):"",a=[],o=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return o&&a.push(o),i.camera!==void 0&&a.push(s.getDependency("camera",i.camera).then(function(l){return s._getNodeRef(s.cameraCache,i.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let c;if(i.isBone===!0?c=new rs:l.length>1?c=new pe:l.length===1?c=l[0]:c=new mt,c!==l[0])for(let u=0,f=l.length;u<f;u++)c.add(l[u]);if(i.name&&(c.userData.name=i.name,c.name=r),U(c,i),i.extensions&&V(n,c,i),i.matrix!==void 0){const u=new ge;u.fromArray(i.matrix),c.applyMatrix4(u)}else i.translation!==void 0&&c.position.fromArray(i.translation),i.rotation!==void 0&&c.quaternion.fromArray(i.rotation),i.scale!==void 0&&c.scale.fromArray(i.scale);if(!s.associations.has(c))s.associations.set(c,{});else if(i.mesh!==void 0&&s.meshCache.refs[i.mesh]>1){const u=s.associations.get(c);s.associations.set(c,{...u})}return s.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,i=new pe;n.name&&(i.name=s.createUniqueName(n.name)),U(i,n),n.extensions&&V(t,i,n);const r=n.nodes||[],a=[];for(let o=0,l=r.length;o<l;o++)a.push(s.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let c=0,u=o.length;c<u;c++){const f=o[c];f.parent!==null?i.add(Ls(f)):i.add(f)}const l=c=>{const u=new Map;for(const[f,d]of s.associations)(f instanceof we||f instanceof Ye)&&u.set(f,d);return c.traverse(f=>{const d=s.associations.get(f);d!=null&&u.set(f,d)}),u};return s.associations=l(i),i})}_createAnimationTracks(e,t,n,s,i){const r=[],a=e.name?e.name:e.uuid,o=[];function l(d){d.morphTargetInfluences&&o.push(d.name?d.name:d.uuid)}G[i.path]===G.weights?(l(e),e.isGroup&&e.children.forEach(l)):o.push(a);let c;switch(G[i.path]){case G.weights:c=Ze;break;case G.rotation:c=Je;break;case G.translation:case G.scale:c=$e;break;default:switch(n.itemSize){case 1:c=Ze;break;case 2:case 3:default:c=$e;break}break}const u=s.interpolation!==void 0?sn[s.interpolation]:Mt,f=this._getArrayFromAccessor(n);for(let d=0,p=o.length;d<p;d++){const g=new c(o[d]+"."+G[i.path],t.array,f,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),r.push(g)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Ie(t.constructor),s=new Float32Array(t.length);for(let i=0,r=t.length;i<r;i++)s[i]=t[i]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof Je?tn:yt;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function hn(h,e,t){const n=e.attributes,s=new wt;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],o=a.min,l=a.max;if(o!==void 0&&l!==void 0){if(s.set(new L(o[0],o[1],o[2]),new L(l[0],l[1],l[2])),a.normalized){const c=Ie(Y[a.componentType]);s.min.multiplyScalar(c),s.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const i=e.targets;if(i!==void 0){const a=new L,o=new L;for(let l=0,c=i.length;l<c;l++){const u=i[l];if(u.POSITION!==void 0){const f=t.json.accessors[u.POSITION],d=f.min,p=f.max;if(d!==void 0&&p!==void 0){if(o.setX(Math.max(Math.abs(d[0]),Math.abs(p[0]))),o.setY(Math.max(Math.abs(d[1]),Math.abs(p[1]))),o.setZ(Math.max(Math.abs(d[2]),Math.abs(p[2]))),f.normalized){const g=Ie(Y[f.componentType]);o.multiplyScalar(g)}a.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}h.boundingBox=s;const r=new cs;s.getCenter(r.center),r.radius=s.min.distanceTo(s.max)/2,h.boundingSphere=r}function lt(h,e,t){const n=e.attributes,s=[];function i(r,a){return t.getDependency("accessor",r).then(function(o){h.setAttribute(a,o)})}for(const r in n){const a=De[r]||r.toLowerCase();a in h.attributes||s.push(i(n[r],a))}if(e.indices!==void 0&&!h.index){const r=t.getDependency("accessor",e.indices).then(function(a){h.setIndex(a)});s.push(r)}return Pe.workingColorSpace!==B&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Pe.workingColorSpace}" not supported.`),U(h,e),hn(h,e,t),Promise.all(s).then(function(){return e.targets!==void 0?rn(h,e.targets,t):h})}const me={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Z{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const fn=new _t(-1,1,1,-1,0,1);class dn extends Fe{constructor(){super(),this.setAttribute("position",new et([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new et([0,2,0,0,2,0],2))}}const pn=new dn;class ke{constructor(e){this._mesh=new vt(pn,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,fn)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Oe extends Z{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof K?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=xe.clone(e.uniforms),this.material=new K({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ke(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ct extends Z{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let r,a;this.inverse?(r=0,a=1):(r=1,a=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),i.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),i.buffers.stencil.setClear(a),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(s.EQUAL,1,4294967295),i.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),i.buffers.stencil.setLocked(!0)}}class mn extends Z{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class gn{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new N);this._width=n.width,this._height=n.height,t=new q(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ne}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Oe(me),this.copyPass.material.blending=us,this.timer=new Et}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,i=this.passes.length;s<i;s++){const r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){const a=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ct!==void 0&&(r instanceof ct?n=!0:r instanceof mn&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new N);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Tn extends Z{constructor(e,t,n=null,s=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new P}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let i,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=s}}const xn={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new P(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class $ extends Z{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new N(e.x,e.y):new N(256,256),this.clearColor=new P(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new q(i,r,{type:ne,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){const u=new q(i,r,{type:ne,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+c,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new q(i,r,{type:ne,depthBuffer:!1});f.texture.name="UnrealBloomPass.v"+c,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),i=Math.round(i/2),r=Math.round(r/2)}const a=xn;this.highPassUniforms=xe.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new K({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const o=[6,10,14,18,22];i=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(o[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new N(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=xe.clone(me.uniforms),this.blendMaterial=new K({uniforms:this.copyUniforms,vertexShader:me.vertexShader,fragmentShader:me.fragmentShader,premultipliedAlpha:!0,blending:hs,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new P,this._oldClearAlpha=1,this._basic=new j,this._fsQuad=new ke(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let i=0;i<this.nMips;i++)this.renderTargetsHorizontal[i].setSize(n,s),this.renderTargetsVertical[i].setSize(n,s),this.separableBlurMaterials[i].uniforms.invSize.value=new N(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,i){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),i&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let o=0;o<this.nMips;o++)this._fsQuad.material=this.separableBlurMaterials[o],this.separableBlurMaterials[o].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[o].uniforms.direction.value=$.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[o]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[o].uniforms.colorTexture.value=this.renderTargetsHorizontal[o].texture,this.separableBlurMaterials[o].uniforms.direction.value=$.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[o]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[o];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,i&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);const s=[],i=[];for(let r=1;r<e;r+=2){const a=t[r],o=r+1<e?t[r+1]:0,l=a+o;s.push((r*a+(r+1)*o)/l),i.push(l)}return new K({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new N(.5,.5)},direction:{value:new N(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new K({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}$.BlurDirectionX=new N(1,0);$.BlurDirectionY=new N(0,1);const ue={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class vn extends Z{constructor(){super(),this.isOutputPass=!0,this.uniforms=xe.clone(ue.uniforms),this.material=new fs({name:ue.name,uniforms:this.uniforms,vertexShader:ue.vertexShader,fragmentShader:ue.fragmentShader}),this._fsQuad=new ke(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Pe.getTransfer(this._outputColorSpace)===ds&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ps?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ms?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===gs?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===bt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ts?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===xs?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===vs&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Sn={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new N(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},_n=`
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`,Mn=`
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uPatternScale;
uniform float uIntensity;
uniform float uBrightness;

void main() {
  vec3 V = normalize(cameraPosition - vWorldPosition);
  // Interpolated normals can collapse to ~zero across hard seams; normalize() would emit NaN.
  float nLen = length(vWorldNormal);
  vec3 N = nLen > 1e-4 ? vWorldNormal / nLen : V;
  float ndv = max(dot(N, V), 1e-4);
  float F = 1.0 - ndv;
  float inten = clamp(uIntensity, 0.0, 2.0);
  float d = inten - 1.0;
  float up = max(d, 0.0);
  float down = max(-d, 0.0);

  float fresnelWide = pow(F, 1.28);
  float fresnel = pow(F, 2.05);
  float fresnelTight = pow(F, 5.0);

  float sc = clamp(uPatternScale, 0.1, 5.0);
  float logMin = -3.321928094887362;
  float logMax = 2.321928094887362;
  float u = (log2(sc) - logMin) / (logMax - logMin);
  float wFreq = mix(2.923, 0.25, u);
  vec3 pw = vWorldPosition * wFreq;
  float t = uTime * (wFreq / 1.35);

  float oil =
    sin(pw.x * 0.72 + t * 0.72) * cos(pw.y * 0.78 - t * 0.62) +
    sin(pw.z * 0.68 + t * 0.42) * 0.45 +
    sin(dot(pw, vec3(0.72, 1.02, 0.58)) * 1.05 + t * 0.85) * 0.35;
  oil *= 1.0 - down * 0.45 + up * 0.72;

  float film =
    fresnel * (6.2 + up * 2.2 - down * 2.0) +
    oil * (1.45 + up * 0.6 - down * 0.5) +
    dot(N, vec3(0.15, 0.97, 0.18)) * (0.38 + up * 0.14 - down * 0.16) +
    t * (0.48 + up * 0.2 - down * 0.2);

  float chrom = fresnel * fresnel * (1.55 + up * 0.2 - down * 0.7);
  vec3 phase = film * vec3(3.45, 4.15, 4.95) + vec3(0.0, 2.2, 5.0);
  phase += vec3(chrom * 1.05, -chrom * 0.78, chrom * 0.92);

  vec3 holo = 0.5 + 0.53 * cos(phase);
  holo *= 0.96 + 0.04 * sin(film * 4.2 + t * 1.15);
  holo = pow(max(holo, vec3(0.0)), vec3(0.93 - down * 0.07 + up * 0.07));

  vec3 base = vec3(0.0035, 0.0065, 0.0165);
  float rimMix = fresnelWide * 0.82 + fresnel * 0.58 + fresnelTight * 0.38;
  rimMix = clamp(rimMix * (1.0 + up * 0.28 - down * 0.58), 0.0, 1.0);
  vec3 col = mix(base, holo, rimMix);

  vec3 L = normalize(vec3(0.42, 0.9, 0.36));
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float spHi = pow(nh, 228.0);
  float spLo = pow(nh, 68.0);
  vec3 specTint = mix(vec3(0.72, 0.94, 1.05), vec3(1.05, 0.58, 0.92), fresnel);
  col += specTint * (spHi * 1.25 + spLo * 0.38) * (0.18 + fresnel * 0.92) * (1.0 + up * 0.2 - down * 0.33);

  vec3 rimPink = vec3(1.0, 0.28, 0.82);
  col += fresnelTight * rimPink * (0.62 + up * 0.43 - down * 0.44);
  col += fresnel * vec3(0.1, 0.48, 1.05) * (0.48 + up * 0.24 - down * 0.26);
  col += oil * (fresnel + 0.15) * vec3(0.2, 0.88, 1.0) * (0.14 + up * 0.1 - down * 0.08);

  col = max(col * uBrightness, vec3(0.0));
  // NaN/Inf fails every comparison; one bad pixel turns into a black block after the bloom blur.
  if (!(col.r < 1e4 && col.g < 1e4 && col.b < 1e4)) col = vec3(0.0);
  gl_FragColor = vec4(col, 1.0);
}
`;function wn({patternScale:h=1,intensity:e=1,brightness:t=1}={}){return new K({uniforms:{uTime:{value:0},uPatternScale:{value:h},uIntensity:{value:e},uBrightness:{value:t*2}},vertexShader:_n,fragmentShader:Mn})}const ut={shaderAnimationSpeed:.4,patternScale:.5,intensity:.25,brightness:1},En=.5,he={axis:new L(1,0,.45).normalize(),speed:-.16,bobAmplitude:.05,bobSpeed:.45},fe={yawSpeed:-.12,pitchAmplitude:.38,pitchSpeed:.21,resumeRate:.8},bn=2,te={fov:45,position:new L(-1.0023584236479681,-.0011811847795336061,-1.42632454125149),target:new L(-.1380760336846219,-.2324481589637001,-.03764419707844621)},de={threshold:1*.78+.08,strength:.2,radius:.2,tint:"#ffb3d9"},Rn=1.2,An=2,yn={uniforms:{tDiffuse:{value:null},tOverlay:{value:null},tVideo:{value:null},tModelMask:{value:null},uVideoMix:{value:0},uVideoScale:{value:new N(1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform sampler2D tOverlay;
    uniform sampler2D tVideo;
    uniform sampler2D tModelMask;
    uniform float uVideoMix;
    uniform vec2 uVideoScale;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float occluded = texture2D(tModelMask, vUv).r;
      vec3 v = texture2D(tVideo, (vUv - 0.5) * uVideoScale + 0.5).rgb * uVideoMix * (1.0 - occluded);
      c = 1.0 - (1.0 - c) * (1.0 - v);
      vec4 ui = texture2D(tOverlay, vUv);
      gl_FragColor = vec4(mix(c, abs(ui.rgb - c), ui.a), 1.0);
    }
  `};function Ln(h,{modelUrl:e,videoUrl:t,paintOverlay:n,onReady:s}){const i=document.createElement("canvas"),r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=new Ss({antialias:!1,powerPreference:"high-performance"});a.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.setClearColor(0,1),a.toneMapping=bt,a.toneMappingExposure=1,h.appendChild(a.domElement);const o=new _s,l=new St(te.fov,1,.1,100);l.position.copy(te.position);const c=new Ms(l,a.domElement);c.enableDamping=!0,c.dampingFactor=.08,c.enablePan=!1,c.target.copy(te.target),c.minDistance=.6,c.maxDistance=6,c.minPolarAngle=.15,c.maxPolarAngle=Math.PI-.15;let u=!1;c.addEventListener("start",()=>{u=!0}),c.addEventListener("end",()=>{u=!1});const f=new gn(a,new q(1,1,{type:ne}));f.addPass(new Tn(o,l));const d=new $(new N(1,1),de.strength,de.radius,de.threshold),p=new P(de.tint);for(const b of d.bloomTintColors)b.set(p.r,p.g,p.b);f.addPass(d),f.addPass(new vn);const g=new Oe(Sn);f.addPass(g);const m=new ws(i);m.minFilter=re,m.generateMipmaps=!1;const T=new Oe(yn);T.uniforms.tOverlay.value=m,f.addPass(T);const x=document.createElement("video"),_=new Es(x);_.minFilter=re,_.generateMipmaps=!1,T.uniforms.tVideo.value=_;const S=new q(1,1,{samples:4}),w=new j({color:16777215});T.uniforms.tModelMask.value=S.texture;const C=new P(0);function M(){o.overrideMaterial=w,a.setRenderTarget(S),a.setClearColor(C,1),a.clear(),a.render(o,l),a.setRenderTarget(null),o.overrideMaterial=null}let y=16/9;const F=()=>x.play().catch(()=>{});T.uniforms.uVideoMix.value=0;let W=!1,X=!t;function Ue(){W&&X&&(s==null||s())}t&&(x.muted=!0,x.loop=!0,x.playsInline=!0,x.preload="auto",x.addEventListener("loadeddata",()=>{y=x.videoWidth/x.videoHeight||y,Be(),X=!0,Ue()}),x.src=t,r||(F(),window.addEventListener("pointerdown",F,{once:!0})));function Be(){const b=a.domElement.width/a.domElement.height||1;T.uniforms.uVideoScale.value.set(Math.min(1,b/y),Math.min(1,y/b))}const ve=wn(ut),z=new pe;z.scale.setScalar(0),o.add(z);let He=!1;new Cs().load(e,b=>{if(He)return;const R=b.scene;R.traverse(ce=>{ce.isMesh&&(ce.material=ve)});const H=new wt().setFromObject(R),I=H.getSize(new L),_e=H.getCenter(new L),le=bn/Math.max(I.x,I.y,I.z);R.scale.multiplyScalar(le),R.position.sub(_e.multiplyScalar(le)),z.add(R),W=!0,Ue()});function Ge(){const b=h.clientWidth||window.innerWidth,R=h.clientHeight||window.innerHeight,H=b/R,I=a.getPixelRatio();a.setSize(b,R,!1),f.setPixelRatio(I),f.setSize(b,R),S.setSize(b*I,R*I),g.material.uniforms.resolution.value.set(1/(b*I),1/(R*I)),l.aspect=H,l.updateProjectionMatrix();const _e=Ne.clamp(Rn/H,1,An),le=l.position.clone().sub(c.target),ce=te.position.distanceTo(te.target);l.position.copy(c.target).add(le.setLength(ce*_e)),c.update(),Be(),ze()}function ze(){const{width:b,height:R}=i;n(i,a.getPixelRatio()),(i.width!==b||i.height!==R)&&m.dispose(),m.needsUpdate=!0}const Ve=new ResizeObserver(Ge);Ve.observe(h),Ge();const oe=new Et;oe.connect(document);let Se=0;const je=new L,J=new bs,Ct=new L(0,1,0),Ke=new Te,We=new Te;let ae=1,Xe=0,Qe=0;function Nt(b){ae+=((u?0:1)-ae)*Math.min(1,b*fe.resumeRate),Xe+=b*fe.pitchSpeed*ae;const H=fe.pitchAmplitude*Math.sin(Xe),I=H-Qe;Qe=H,je.copy(l.position).sub(c.target),J.setFromVector3(je),J.theta+=fe.yawSpeed*b*ae,J.phi=Ne.clamp(J.phi+I,c.minPolarAngle,c.maxPolarAngle),l.position.setFromSpherical(J).add(c.target)}return a.setAnimationLoop(b=>{oe.update(b);const R=Math.min(oe.getDelta(),.1);Se+=R,ve.uniforms.uTime.value=Se*ut.shaderAnimationSpeed,r||(Ke.setFromAxisAngle(Ct,R*En),We.setFromAxisAngle(he.axis,R*he.speed),z.quaternion.premultiply(Ke).premultiply(We).normalize(),z.position.y=he.bobAmplitude*Math.sin(Se*he.bobSpeed),Nt(R)),c.update(),t&&M(),f.render()}),{repaintOverlay:ze,intro:{videoMix:T.uniforms.uVideoMix,modelScale:z.scale},dispose(){He=!0,a.setAnimationLoop(null),oe.dispose(),Ve.disconnect(),c.dispose(),z.traverse(b=>{var R;return(R=b.geometry)==null?void 0:R.dispose()}),ve.dispose(),m.dispose(),window.removeEventListener("pointerdown",F),x.pause(),x.removeAttribute("src"),x.load(),_.dispose(),S.dispose(),w.dispose(),f.dispose(),a.dispose(),a.domElement.remove()}}}const ht=new Map;function Lt(h){let e=ht.get(h);if(!e){const t=new Image;e={img:t,ready:new Promise(n=>t.onload=n)},t.src=h,ht.set(h,e)}return e}function Cn(h,e,t,n){const s=getComputedStyle(e);if(s.visibility==="hidden")return;const i=Number(s.opacity);if(!(i>0))return;h.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`,h.fillStyle=t,h.textBaseline="alphabetic";const r=h.measureText("Hg"),a=r.fontBoundingBoxAscent??r.actualBoundingBoxAscent,o=r.fontBoundingBoxDescent??r.actualBoundingBoxDescent,l=document.createRange(),c=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let u=c.nextNode();u;u=c.nextNode()){const f=getComputedStyle(u.parentElement);if(f.visibility==="hidden")continue;const d=i*Number(f.opacity);if(!(d>0))continue;h.save(),h.globalAlpha=d;const p=u.textContent;for(let g=0;g<p.length;g++){if(/\s/.test(p[g]))continue;l.setStart(u,g),l.setEnd(u,g+1);const m=l.getClientRects()[0];if(!m)continue;const T=m.top+m.height*a/(a+o);h.fillText(p[g],m.left-n.left,T-n.top)}h.restore()}}function Nn(h,e,t,n,s){const i=getComputedStyle(e),r=Number(i.opacity);if(!(r>0)||i.visibility==="hidden")return;const{img:a}=Lt(s);if(!a.complete||!a.naturalWidth)return;const o=e.getBoundingClientRect(),l=h.getTransform().a,c=Math.max(1,Math.round(o.width*l)),u=Math.max(1,Math.round(o.height*l)),f=document.createElement("canvas");f.width=c,f.height=u;const d=f.getContext("2d");d.drawImage(a,0,0,c,u),d.globalCompositeOperation="source-in",d.fillStyle=t,d.fillRect(0,0,c,u),h.save(),h.globalAlpha=r,h.drawImage(f,o.left-n.left,o.top-n.top,o.width,o.height),h.restore()}function Pn(h,e,{texts:t,marks:n,dpr:s}){const i=e.getBoundingClientRect(),r=Math.max(1,Math.round(i.width*s)),a=Math.max(1,Math.round(i.height*s));(h.width!==r||h.height!==a)&&(h.width=r,h.height=a);const o=h.getContext("2d");o.setTransform(1,0,0,1,0,0),o.clearRect(0,0,r,a),o.setTransform(s,0,0,s,0,0);for(const{el:l,color:c}of t)Cn(o,l,c,i);for(const{el:l,color:c,url:u}of n)Nn(o,l,c,i,u)}function Dn(h){return Promise.all(h.map(e=>Lt(e).ready))}const In="https://framerate.tv/watch/4Msh9IGs",On=["mailto:hello","stellanjohansson.com"].join("@"),Fn="/excavator.glb",kn="/microreel.mp4",Ae="#ffffff",ft="#c4ff00",Un=["This","website","is","still","under","construction"];function ye({word:h}){return A.jsx("span",{className:"holding-word",children:h})}function Bn({words:h}){return h.map((e,t)=>e==="still"?A.jsxs("span",{className:"holding-keep",children:[t>0?" ":null,A.jsx(ye,{word:"still"})," ",A.jsx("br",{className:"holding-title-break"}),A.jsx(ye,{word:"under"})]},"still-under"):e==="under"?null:A.jsxs("span",{children:[t>0?" ":null,A.jsx(ye,{word:e})]},`${e}-${t}`))}function Hn(){const h=k.useRef(null),e=k.useRef(null),t=k.useRef(null),n=k.useRef(null),s=k.useRef(null),i=k.useRef(null),[r,a]=k.useState(!1);return k.useEffect(()=>{const l=[...s.current.querySelectorAll("a")],c=[...n.current.querySelectorAll(".holding-word")];let u=null;const f=(x,_)=>Pn(x,h.current,{dpr:_,texts:[{el:n.current,color:Ae},...l.map(S=>({el:S,color:S===u?ft:Ae}))],marks:[{el:t.current,color:u===t.current?ft:Ae,url:st}]}),d=Ln(h.current,{modelUrl:Fn,videoUrl:kn,paintOverlay:f,onReady:()=>a(!0)});i.current=d,Q.set([t.current,...c,...l],{autoAlpha:0,y:28});const p=()=>d.repaintOverlay();Promise.all([document.fonts.ready,Dn([st])]).then(p),document.fonts.addEventListener("loadingdone",p);const g=[...l,t.current],m=x=>{u=x.currentTarget,p()},T=()=>{u=null,p()};for(const x of g)x.addEventListener("pointerenter",m),x.addEventListener("pointerleave",T);return()=>{document.fonts.removeEventListener("loadingdone",p);for(const x of g)x.removeEventListener("pointerenter",m),x.removeEventListener("pointerleave",T);i.current=null,d.dispose()}},[]),k.useEffect(()=>{if(!r)return;const o=i.current;if(!o)return;const l=[...s.current.querySelectorAll("a")],c=[...n.current.querySelectorAll(".holding-word")],u=[t.current,...c,...l],{videoMix:f,modelScale:d}=o.intro,p=window.matchMedia("(prefers-reduced-motion: reduce)").matches,g=Q.context(()=>{const m=()=>o.repaintOverlay();if(p){Q.set(f,{value:1}),Q.set(d,{x:1,y:1,z:1}),Q.set(u,{autoAlpha:1,y:0}),m();return}Q.timeline().to(f,{value:1,duration:1.2,ease:"power2.out"}).to(d,{x:1,y:1,z:1,duration:1,ease:"power4.out"}).to(u,{autoAlpha:1,y:0,duration:.7,stagger:.08,ease:"power3.out",onUpdate:m,onComplete:m})},e);return()=>g.revert()},[r]),A.jsx("div",{className:"shell",children:A.jsxs("div",{className:r?"hero hero--holding is-blended":"hero hero--holding",children:[A.jsx("div",{className:r?"holding-scene is-ready":"holding-scene",ref:h}),A.jsxs("div",{className:"holding-layout",ref:e,children:[A.jsx("div",{className:"site-mark",ref:t,"aria-hidden":"true"}),A.jsx("h1",{className:"holding-title",ref:n,children:A.jsx(Bn,{words:Un})}),A.jsxs("nav",{className:"site-nav",ref:s,children:[A.jsx("a",{className:"site-contact",href:In,target:"_blank",rel:"noopener noreferrer",children:"Showreel"}),A.jsx("a",{className:"site-contact",href:"https://www.linkedin.com/in/stellanj/",target:"_blank",rel:"noopener noreferrer",children:"LinkedIn"}),A.jsx("a",{className:"site-contact",href:"https://x.com/johstell",target:"_blank",rel:"noopener noreferrer",children:"X"}),A.jsx("a",{className:"site-contact",href:On,children:"Email me"})]})]})]})})}k.lazy(()=>ys(()=>import("./Editor-BB62yR8l.js"),__vite__mapDeps([0,1,2,3,4])).then(h=>({default:h.Editor})));function Gn(){return A.jsx(Hn,{})}Pt.createRoot(document.getElementById("root")).render(A.jsx(Gn,{}));
