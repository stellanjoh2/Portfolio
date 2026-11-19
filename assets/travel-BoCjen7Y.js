import{r as O,j as c,c as Ne}from"./editor-DX1uJZi4.js";import{az as Re,ac as we,aA as ae,m as R,aB as Ie,aa as ce,ab as Ce,g as E,ad as We,aC as K,ae as Ue,V as Ge,aD as Z,G as je,aE as H,aF as ke,f as He,Y as Ve,at as $e,au as qe,X as Je,av as Xe,W as Ye,z as Ke,aG as Ze,w as Qe,u as et,B as le,U as Se,H as tt,aw as nt,S as it,k as be}from"./OrbitControls-DD8uEuCZ.js";const Ee=new ce,q=new E;class Le extends Re{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new we(e,3)),this.setAttribute("uv",new we(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new ae(t,6,1);return this.setAttribute("instanceStart",new R(i,3,0)),this.setAttribute("instanceEnd",new R(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new ae(t,6,1);return this.setAttribute("instanceColorStart",new R(i,3,0)),this.setAttribute("instanceColorEnd",new R(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ie(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ce);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Ee.setFromBufferAttribute(t),this.boundingBox.union(Ee))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ce),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let a=0,u=e.count;a<u;a++)q.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared(q)),q.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared(q));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}Z.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ge},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};K.line={uniforms:Ue.merge([Z.common,Z.fog,Z.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = perspective ? normalize( mix( start.xyz, end.xyz, 0.5 ) ) : vec3( 0.0, 0.0, - 1.0 );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;

				// only shift the depth of vertices in front of the camera (#35137)
				if ( clip.w > 0.0 ) clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				float len;

				if ( isOrthographic ) {

					// View rays are parallel to the z axis so the distance reduces to camera-space XY
					vec2 lineDir = worldEnd.xy - worldStart.xy;
					float t = clamp( dot( worldPos.xy - worldStart.xy, lineDir ) / dot( lineDir, lineDir ), 0.0, 1.0 );
					len = length( worldStart.xy + lineDir * t - worldPos.xy );

				} else {

					// Find the closest points on the view ray and the line segment
					vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
					vec3 lineDir = worldEnd - worldStart;
					vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

					vec3 p1 = worldStart + lineDir * params.x;
					vec3 p2 = rayEnd * params.y;
					vec3 delta = p1 - p2;
					len = length( delta );

				}

				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class de extends We{constructor(e){super({type:"LineMaterial",uniforms:Ue.clone(K.line.uniforms),vertexShader:K.line.vertexShader,fragmentShader:K.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const ie=new H,Me=new E,ze=new E,v=new H,w=new H,C=new H,se=new E,oe=new He,S=new ke,_e=new E,J=new ce,X=new Ce,U=new H;let j,N;function Ae(o,e,t){return U.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),U.multiplyScalar(1/U.w),U.x=N/t.width,U.y=N/t.height,U.applyMatrix4(o.projectionMatrixInverse),U.multiplyScalar(1/U.w),Math.abs(Math.max(U.x,U.y))}function st(o,e){const t=o.matrixWorld,i=o.geometry,n=i.attributes.instanceStart,a=i.attributes.instanceEnd,u=Math.min(i.instanceCount,n.count);for(let d=0,f=u;d<f;d++){S.start.fromBufferAttribute(n,d),S.end.fromBufferAttribute(a,d),S.applyMatrix4(t);const h=new E,x=new E;j.distanceSqToSegment(S.start,S.end,x,h),x.distanceTo(h)<N*.5&&e.push({point:x,pointOnLine:h,distance:j.origin.distanceTo(x),object:o,face:null,faceIndex:d,uv:null,uv1:null})}}function ot(o,e,t){const i=e.projectionMatrix,a=o.material.resolution,u=o.matrixWorld,d=o.geometry,f=d.attributes.instanceStart,h=d.attributes.instanceEnd,x=Math.min(d.instanceCount,f.count),l=-e.near;j.at(1,C),C.w=1,C.applyMatrix4(e.matrixWorldInverse),C.applyMatrix4(i),C.multiplyScalar(1/C.w),C.x*=a.x/2,C.y*=a.y/2,C.z=0,se.copy(C),oe.multiplyMatrices(e.matrixWorldInverse,u);for(let m=0,s=x;m<s;m++){if(v.fromBufferAttribute(f,m),w.fromBufferAttribute(h,m),v.w=1,w.w=1,v.applyMatrix4(oe),w.applyMatrix4(oe),v.z>l&&w.z>l)continue;if(v.z>l){const b=v.z-w.z,z=(v.z-l)/b;v.lerp(w,z)}else if(w.z>l){const b=w.z-v.z,z=(w.z-l)/b;w.lerp(v,z)}v.applyMatrix4(i),w.applyMatrix4(i),v.multiplyScalar(1/v.w),w.multiplyScalar(1/w.w),v.x*=a.x/2,v.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,S.start.copy(v),S.start.z=0,S.end.copy(w),S.end.z=0;const y=S.closestPointToPointParameter(se,!0);S.at(y,_e);const M=Ve.lerp(v.z,w.z,y),L=M>=-1&&M<=1,T=se.distanceTo(_e)<N*.5;if(L&&T){S.start.fromBufferAttribute(f,m),S.end.fromBufferAttribute(h,m),S.start.applyMatrix4(u),S.end.applyMatrix4(u);const b=new E,z=new E;j.distanceSqToSegment(S.start,S.end,z,b),t.push({point:z,pointOnLine:b,distance:j.origin.distanceTo(z),object:o,face:null,faceIndex:m,uv:null,uv1:null})}}}class rt extends je{constructor(e=new Le,t=new de({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let u=0,d=0,f=t.count;u<f;u++,d+=2)Me.fromBufferAttribute(t,u),ze.fromBufferAttribute(i,u),n[d]=d===0?0:n[d-1],n[d+1]=n[d]+Me.distanceTo(ze);const a=new ae(n,2,1);return e.setAttribute("instanceDistanceStart",new R(a,1,0)),e.setAttribute("instanceDistanceEnd",new R(a,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;if(n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),i===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;j=e.ray;const u=this.matrixWorld,d=this.geometry,f=this.material;N=f.linewidth+a,d.boundingSphere===null&&d.computeBoundingSphere(),X.copy(d.boundingSphere).applyMatrix4(u);let h;if(i)h=N*.5;else{const l=Math.max(n.near,X.distanceToPoint(j.origin));h=Ae(n,l,f.resolution)}if(X.radius+=h,j.intersectsSphere(X)===!1)return;d.boundingBox===null&&d.computeBoundingBox(),J.copy(d.boundingBox).applyMatrix4(u);let x;if(i)x=N*.5;else{const l=Math.max(n.near,J.distanceToPoint(j.origin));x=Ae(n,l,f.resolution)}J.expandByScalar(x),j.intersectsBox(J)!==!1&&(i?st(this,t):ot(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(ie),this.material.uniforms.resolution.value.set(ie.z,ie.w))}}class Be extends Le{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setColors(i),this}setFromPoints(e){const t=e.length-1,i=new Float32Array(6*t);for(let n=0;n<t;n++)i[6*n]=e[n].x,i[6*n+1]=e[n].y,i[6*n+2]=e[n].z||0,i[6*n+3]=e[n+1].x,i[6*n+4]=e[n+1].y,i[6*n+5]=e[n+1].z||0;return super.setPositions(i),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class at extends rt{constructor(e=new Be,t=new de({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const k=160,Q=Math.PI/180,lt=4.2,De={linear:o=>o,"sine.inOut":o=>.5-.5*Math.cos(Math.PI*o),"cubic.inOut":o=>o<.5?4*o*o*o:1-(-2*o+2)**3/2,"cubic.out":o=>1-(1-o)**3,"expo.inOut":o=>o<=0?0:o>=1?1:o<.5?2**(20*o-10)/2:(2-2**(-20*o+10))/2,"expo.out":o=>o>=1?1:1-2**(-10*o)};function ct(o){let e=o>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function I(o,e){const t=(90-o)*Q,i=(e+180)*Q;return new E(-Math.sin(t)*Math.cos(i),Math.cos(t),Math.sin(t)*Math.sin(i))}function dt(){const e=document.createElement("canvas");e.width=e.height=64;const t=e.getContext("2d");t.fillStyle="#fff",t.beginPath(),t.arc(64/2,64/2,64/2-1,0,Math.PI*2),t.fill();const i=new nt(e);return i.colorSpace=it,i}function ut(o){const e=[],i=(n,a)=>e.push(n.multiplyScalar(1.0015),a.multiplyScalar(1.0015));for(let n=-75;n<=75;n+=15)for(let a=0;a<360;a+=3)i(I(n,a),I(n,a+3));for(let n=0;n<360;n+=15)for(let a=-90;a<90;a+=3)i(I(a,n),I(a+3,n));return new tt(new le().setFromPoints(e),o)}function ft(o,e,t,i,n){let a=new E(0,1,0).cross(o);a.lengthSq()<1e-8&&(a=new E(0,0,-1)),a.normalize();const d=new E().crossVectors(o,a).multiplyScalar(Math.cos(e)).addScaledVector(a,Math.sin(e)),f=(l,m=new E)=>{const s=t*l,p=1+i+n*t*Math.sin(Math.PI*l);return m.copy(o).multiplyScalar(Math.cos(s)).addScaledVector(d,Math.sin(s)).multiplyScalar(p)},h=new Float32Array((k+1)*3),x=new E;for(let l=0;l<=k;l++)f(l/k,x).toArray(h,l*3);return{samples:h,pointAt:f}}function pt(o,e){let t=e;const i=new $e({canvas:o,antialias:!0});i.setPixelRatio(window.devicePixelRatio);const n=new qe,a=new Je(30,1,.01,100),u=new Xe(a,o);u.enablePan=!1,u.enableDamping=!0,u.dampingFactor=.08,u.rotateSpeed=.6,u.minDistance=1.3,u.maxDistance=20;const d=new Ye;n.add(d);const f=new Ke({color:t.sphereColor}),h=new je(new Ze(1,128,96),f);d.add(h);const x=new Qe({color:t.gridColor}),l=ut(x);d.add(l);const m=new de({color:t.lineColor,linewidth:t.lineWidth}),s=dt(),p=new et({color:t.dotColor,size:t.dotSize,sizeAttenuation:!1,map:s,transparent:!0,alphaTest:.01}),y=new le,M=new Se(y,p);M.frustumCulled=!1,d.add(M);const L=new le,T=new Se(L,p);T.frustumCulled=!1,d.add(T);let b=[],z=performance.now(),ee=0;const W=new E;function ue(){for(const r of b)d.remove(r.line),r.line.geometry.dispose();b=[]}function fe(){ue();const r=t,g=ct(r.seed*9973+17),B=I(r.lat,r.lon),D=Math.min(r.minDist,r.maxDist),P=Math.max(r.minDist,r.maxDist),F=g()*Math.PI*2;for(let A=0;A<r.count;A++){const te=F+(A+(g()-.5)*r.bearingJitter)/r.count*Math.PI*2,V=(D+(P-D)*g())*Q,ve=ft(B,te,V,r.altitude,r.arc),$=new Be;$.setPositions(ve.samples),$.instanceCount=0;const ne=new at($,m);ne.frustumCulled=!1,d.add(ne),b.push({...ve,line:ne,buffer:$.attributes.instanceStart.data,delay:g(),pace:1+(g()*2-1)*r.speedVariance})}y.setAttribute("position",new be(new Float32Array(r.count*3),3));const _=B.clone().multiplyScalar(1+r.altitude);L.setAttribute("position",new be(new Float32Array(_.toArray()),3))}function pe(r){const g=t;return{begin:r.delay*g.stagger,length:Math.max(.05,g.duration/r.pace)}}function Te(){let r=0;for(const g of b){const{begin:B,length:D}=pe(g);r=Math.max(r,B+D)}return r+t.hold}function Fe(r,g){const D=(De[t.ease]||De.linear)(g);if(r.pointAt(D,W),D<=0){r.line.geometry.instanceCount=0;return}const P=r.buffer.array,F=r.samples,_=Math.min(Math.floor(D*k),k-1);for(let A=0;A<_;A++)P.set(F.subarray(A*3,A*3+6),A*6);P.set(F.subarray(_*3,_*3+3),_*6),W.toArray(P,_*6+3),r.buffer.needsUpdate=!0,r.line.geometry.instanceCount=_+1}function he(r){ee=requestAnimationFrame(he),u.update();let g=(r-z)/1e3;const B=Te();t.loop&&g>B&&(z=r,g=0);const D=Math.max(.001,B-t.hold);d.rotation.y=Math.min(1,g/D)*t.spin*Q;const P=y.attributes.position;let F=0;for(const _ of b){const{begin:A,length:te}=pe(_),V=Math.min(1,Math.max(0,(g-A)/te));Fe(_,V),(V<1||t.keepDots)&&P.setXYZ(F++,W.x,W.y,W.z)}P.needsUpdate=!0,y.setDrawRange(0,F),i.render(n,a)}function me(){const r=o.clientWidth,g=o.clientHeight;i.setSize(r,g,!1),a.aspect=r/g,a.updateProjectionMatrix()}function ge(){const r=I(Math.max(-89,Math.min(89,t.lat-25)),t.lon);a.position.copy(r.multiplyScalar(lt)),u.target.set(0,0,0),u.update()}function xe(){const r=t;i.setClearColor(r.bg),f.color.set(r.sphereColor),x.color.set(r.gridColor),l.visible=r.grid,m.color.set(r.lineColor),m.linewidth=r.lineWidth,p.color.set(r.dotColor),p.size=r.dotSize,M.visible=r.dotSize>0,T.visible=r.originDot&&r.dotSize>0}const ye=new ResizeObserver(me);return ye.observe(o),me(),fe(),xe(),ge(),ee=requestAnimationFrame(he),{update(r){t=r,fe(),xe()},replay(){z=performance.now()},faceOrigin:ge,destroy(){cancelAnimationFrame(ee),ye.disconnect(),u.dispose(),ue(),h.geometry.dispose(),l.geometry.dispose(),y.dispose(),L.dispose(),[f,x,m,p,s].forEach(r=>r.dispose()),i.dispose()}}}const Pe="textfx.travel.v1",ht=["linear","sine.inOut","cubic.inOut","cubic.out","expo.inOut","expo.out"];function Oe(){return{lat:57.71,lon:11.97,count:21,seed:1,minDist:20,maxDist:180,bearingJitter:.5,altitude:.02,arc:.12,duration:3.5,ease:"cubic.inOut",stagger:.4,speedVariance:.2,hold:1,loop:!0,spin:0,lineWidth:1.25,dotSize:17.5,originDot:!0,keepDots:!0,grid:!0,lineColor:"#ffffff",dotColor:"#c8ff00",sphereColor:"#000000",gridColor:"#000000",bg:"#000000"}}function mt(){const o=Oe();try{const e=JSON.parse(localStorage.getItem(Pe)||"null");return e&&typeof e=="object"?{...o,...e}:o}catch{return o}}function gt(o){try{localStorage.setItem(Pe,JSON.stringify(o))}catch{}}function G({title:o,children:e}){return c.jsxs("div",{className:"section",children:[c.jsx("h2",{children:o}),e]})}function re({label:o,value:e,children:t}){return c.jsxs("div",{className:e!=null?"row row--val":"row",children:[c.jsx("label",{children:o}),t,e!=null&&c.jsx("span",{className:"val",children:e})]})}function Y({label:o,checked:e,onChange:t}){return c.jsxs("label",{className:"check",children:[c.jsx("input",{type:"checkbox",checked:e,onChange:i=>t(i.target.checked)}),c.jsx("span",{children:o})]})}function xt(){const o=O.useRef(null),e=O.useRef(null),[t,i]=O.useState(mt),[n,a]=O.useState(!0),[u,d]=O.useState(!1),f=t,h=(s,p)=>i(y=>({...y,[s]:p}));O.useEffect(()=>{const s=pt(o.current,t);return e.current=s,()=>s.destroy()},[]),O.useEffect(()=>{var s;(s=e.current)==null||s.update(t),gt(t)},[t]),O.useEffect(()=>{function s(p){var y,M;((y=p.target)==null?void 0:y.tagName)==="INPUT"&&p.target.type==="text"||(p.key==="F3"?(p.preventDefault(),a(L=>!L)):p.code==="Space"&&(p.preventDefault(),(M=e.current)==null||M.replay()))}return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[]);function x(){navigator.clipboard.writeText(JSON.stringify(t,null,2)),d(!0),window.setTimeout(()=>d(!1),1200)}function l(s,p,y,M,L,T=b=>b){return c.jsx(re,{label:s,value:T(Number(f[p])),children:c.jsx("input",{type:"range",min:y,max:M,step:L,value:f[p],onChange:b=>h(p,Number(b.target.value))})})}function m(s,p){return c.jsx(re,{label:s,children:c.jsx("input",{type:"color",value:f[p],onChange:y=>h(p,y.target.value)})})}return c.jsxs("div",{className:n?"travel":"travel travel--clean",children:[c.jsx("canvas",{ref:o,className:"travel-stage"}),n&&c.jsxs("aside",{className:"panel",children:[c.jsxs("header",{className:"panel-head",children:[c.jsx("h1",{children:"Travel"}),c.jsxs("div",{className:"panel-head-actions",children:[c.jsx("button",{className:"copy",type:"button",onClick:()=>a(!1),children:"hide · F3"}),c.jsx("button",{className:"copy",type:"button",onClick:x,children:u?"copied":"copy"})]})]}),c.jsxs("div",{className:"travel-actions",children:[c.jsx("button",{className:"copy",type:"button",onClick:()=>{var s;return(s=e.current)==null?void 0:s.replay()},children:"replay · space"}),c.jsx("button",{className:"copy",type:"button",onClick:()=>{var s;return(s=e.current)==null?void 0:s.faceOrigin()},children:"face origin"})]}),c.jsxs(G,{title:"Origin",children:[l("latitude","lat",-85,85,.01,s=>`${s.toFixed(2)}°`),l("longitude","lon",-180,180,.01,s=>`${s.toFixed(2)}°`)]}),c.jsxs(G,{title:"Routes",children:[l("lines","count",1,48,1),l("seed","seed",1,200,1),l("min dist","minDist",1,180,1,s=>`${s}°`),l("max dist","maxDist",1,180,1,s=>`${s}°`),l("bearing","bearingJitter",0,1,.01,s=>s.toFixed(2)),l("altitude","altitude",0,.3,.001,s=>s.toFixed(3)),l("arc","arc",0,.5,.005,s=>s.toFixed(3))]}),c.jsxs(G,{title:"Timing",children:[l("duration","duration",.2,10,.05,s=>`${s.toFixed(2)}s`),c.jsx(re,{label:"ease",children:c.jsx("select",{value:f.ease,onChange:s=>{h("ease",s.target.value),s.target.blur()},children:ht.map(s=>c.jsx("option",{value:s,children:s},s))})}),l("stagger","stagger",0,4,.05,s=>`${s.toFixed(2)}s`),l("speed var","speedVariance",0,.6,.01,s=>s.toFixed(2)),l("hold","hold",0,5,.1,s=>`${s.toFixed(1)}s`),l("scene rot","spin",-20,20,.5,s=>`${s}°`),c.jsx(Y,{label:"loop",checked:f.loop,onChange:s=>h("loop",s)})]}),c.jsxs(G,{title:"Look",children:[l("line width","lineWidth",.5,12,.25,s=>`${s}px`),l("dot size","dotSize",0,30,.5,s=>s?`${s}px`:"off"),c.jsx(Y,{label:"dot at origin",checked:f.originDot,onChange:s=>h("originDot",s)}),c.jsx(Y,{label:"keep dots on arrival",checked:f.keepDots,onChange:s=>h("keepDots",s)}),c.jsx(Y,{label:"guide grid",checked:f.grid,onChange:s=>h("grid",s)})]}),c.jsxs(G,{title:"Colours",children:[m("lines","lineColor"),m("dots","dotColor"),m("sphere","sphereColor"),m("grid","gridColor"),m("background","bg")]}),c.jsxs("div",{className:"travel-actions",children:[c.jsx("button",{className:"copy",type:"button",onClick:()=>{var s,p;return(p=(s=document.documentElement).requestFullscreen)==null?void 0:p.call(s)},children:"fullscreen"}),c.jsx("button",{className:"copy",type:"button",onClick:()=>i(Oe()),children:"reset"})]}),c.jsx("p",{className:"travel-note",children:"Drag to rotate the planet, scroll to zoom. F3 hides this panel for recording (on a Mac keyboard it may need fn). Space replays."})]})]})}Ne.createRoot(document.getElementById("root")).render(c.jsx(xt,{}));
