"use strict";(self["webpackChunkgeekideas"]=self["webpackChunkgeekideas"]||[]).push([[627],{236:function(e,t,n){n.r(t),n.d(t,{default:function(){return r}});var o=function(){var e=this,t=e._self._c;return t("div",{staticClass:"box"},[t("div",{staticClass:"image-download"},e._l(e.imgList,(function(n){return t("div",{key:n.id,staticClass:"image-item"},[t("span",[e._v(e._s(n.name))]),t("img",{attrs:{src:n.url}}),t("button",{on:{click:function(t){return e.download(n.downloadURL,n.name)}}},[e._v("下载")])])})),0)])},a=[],d=n(518),s={name:"StorePage",computed:{...(0,d.aH)("store",["imgList"])},methods:{download(e,t){const n=document.createElement("a");n.href=e,n.download=`${t}.txt`,document.body.appendChild(n),n.click(),document.body.removeChild(n)}},created(){console.log("store组件created")}},i=s,c=n(656),l=(0,c.A)(i,o,a,!1,null,"7b4dea17",null),r=l.exports}}]);
//# sourceMappingURL=group-02.9f25f632.js.map