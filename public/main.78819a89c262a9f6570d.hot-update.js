/*! For license information please see main.78819a89c262a9f6570d.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdatechromic("main",{"./app/components/Canvas/index.js":(e,t,s)=>{s.r(t),s.d(t,{default:()=>o});var i=s("./node_modules/ogl/src/core/Renderer.js"),n=s("./node_modules/ogl/src/core/Camera.js"),h=s("./node_modules/ogl/src/core/Transform.js");Object(function(){var e=new Error("Cannot find module './Home'");throw e.code="MODULE_NOT_FOUND",e}());class o{constructor(){this.x={start:0,distance:0,end:0},this.y={start:0,distance:0,end:0},this.createRenderer(),this.createCamera(),this.createScene(),this.onResize(),this.createHome()}createRenderer(){this.renderer=new i.Renderer({alpha:!0,antialias:!0}),this.gl=this.renderer.gl,document.body.appendChild(this.gl.canvas)}createCamera(){this.camera=new n.Camera(this.gl),this.camera.position.z=5}createScene(){this.scene=new h.Transform}createHome(){this.home=new Object(function(){var e=new Error("Cannot find module './Home'");throw e.code="MODULE_NOT_FOUND",e}())({gl:this.gl,scene:this.scene,sizes:this.sizes})}onResize(){this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.perspective({aspect:window.innerWidth/window.innerHeight});const e=this.camera.fov*Math.PI/180,t=2*Math.tan(e/2)*this.camera.position.z,s=t*this.camera.aspect;this.sizes={height:t,width:s},this.home&&this.home.onResize({sizes:this.sizes})}onTouchDown(e){this.isDown=!0,this.x.start=e.touches?e.touches[0].clientX:e.clientX,this.y.start=e.touches?e.touches[0].clientY:e.clientY,this.home&&this.home.onTouchDown({x:this.x.start,y:this.y.start})}onTouchMove(e){if(!this.isDown)return;const t=e.touches?e.touches[0].clientX:e.clientX,s=e.touches?e.touches[0].clientY:e.clientY;this.x.end=t,this.y.end=s,this.home&&this.home.onTouchMove({x:this.x,y:this.y})}onTouchUp(e){this.isDown=!1;const t=e.changedTouches?e.changedTouches[0].clientX:e.clientX,s=e.changedTouches?e.changedTouches[0].clientY:e.clientY;this.x.end=t,this.y.end=s,this.home&&this.home.onTouchUp({x:this.x,y:this.y})}onWheel(e){this.home.onWheel&&this.home.onWheel(e)}update(){this.home&&this.home.update(),this.renderer.render({camera:this.camera,scene:this.scene}),this.renderer.render({camera:this.camera,scene:this.scene})}}}},(function(e){e.h=()=>"8ddef5ee580e411fbab4"}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkosRUFBTUksUUFFVjlDLEtBQUtDLEVBQUVHLElBQU1ILEVBQ2JELEtBQUtLLEVBQUVELElBQU1DLEVBRVRMLEtBQUswQixNQUNQMUIsS0FBSzBCLEtBQUtzQixVQUFVLENBQUUvQyxFQUFHRCxLQUFLQyxFQUFHSSxFQUFHTCxLQUFLSyxHQUU3QyxDQUVBNkMsT0FBQUEsQ0FBUVIsR0FDRjFDLEtBQUswQixLQUFLd0IsU0FDWmxELEtBQUswQixLQUFLd0IsUUFBUVIsRUFFdEIsQ0FFQVMsTUFBQUEsR0FDTW5ELEtBQUswQixNQUNQMUIsS0FBSzBCLEtBQUt5QixTQUVabkQsS0FBS1csU0FBU3lDLE9BQU8sQ0FBRWhDLE9BQVFwQixLQUFLb0IsT0FBUUksTUFBT3hCLEtBQUt3QixRQUN4RHhCLEtBQUtXLFNBQVN5QyxPQUFPLENBQUVoQyxPQUFRcEIsS0FBS29CLE9BQVFJLE1BQU94QixLQUFLd0IsT0FDMUQsa0JDbElGNkIsRUFBb0JDLEVBQUksSUFBTSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9taWMvLi9hcHAvY29tcG9uZW50cy9DYW52YXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2hyb21pYy93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FtZXJhLCBSZW5kZXJlciwgVHJhbnNmb3JtIH0gZnJvbSBcIm9nbFwiO1xuXG5pbXBvcnQgSG9tZSBmcm9tIFwiLi9Ib21lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMueCA9IHtcbiAgICAgIHN0YXJ0OiAwLFxuICAgICAgZGlzdGFuY2U6IDAsXG4gICAgICBlbmQ6IDAsXG4gICAgfTtcbiAgICB0aGlzLnkgPSB7XG4gICAgICBzdGFydDogMCxcbiAgICAgIGRpc3RhbmNlOiAwLFxuICAgICAgZW5kOiAwLFxuICAgIH07XG4gICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgIHRoaXMuY3JlYXRlQ2FtZXJhKCk7XG4gICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuXG4gICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgIHRoaXMuY3JlYXRlSG9tZSgpO1xuICB9XG5cbiAgY3JlYXRlUmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih7IGFscGhhOiB0cnVlLCBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgdGhpcy5nbCA9IHRoaXMucmVuZGVyZXIuZ2w7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmdsLmNhbnZhcyk7XG4gIH1cblxuICBjcmVhdGVDYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgQ2FtZXJhKHRoaXMuZ2wpO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSA1O1xuICB9XG5cbiAgY3JlYXRlU2NlbmUoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUcmFuc2Zvcm0oKTtcbiAgfVxuXG4gIGNyZWF0ZUhvbWUoKSB7XG4gICAgdGhpcy5ob21lID0gbmV3IEhvbWUoeyBnbDogdGhpcy5nbCwgc2NlbmU6IHRoaXMuc2NlbmUsIHNpemVzOiB0aGlzLnNpemVzIH0pO1xuICB9XG5cbiAgb25SZXNpemUoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHRoaXMuY2FtZXJhLnBlcnNwZWN0aXZlKHtcbiAgICAgIGFzcGVjdDogd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gZm92IC0gZmllbGQgb2Ygdmlld1xuICAgIGNvbnN0IGZvdiA9ICh0aGlzLmNhbWVyYS5mb3YgKiBNYXRoLlBJKSAvIDE4MDtcbiAgICBjb25zdCBoZWlnaHQgPSAyICogTWF0aC50YW4oZm92IC8gMikgKiB0aGlzLmNhbWVyYS5wb3NpdGlvbi56O1xuICAgIGNvbnN0IHdpZHRoID0gaGVpZ2h0ICogdGhpcy5jYW1lcmEuYXNwZWN0O1xuXG4gICAgLy8gc2l6ZXMgb2YgdGhlIGZpZWxkIG9mIHZpZXdcbiAgICB0aGlzLnNpemVzID0ge1xuICAgICAgaGVpZ2h0LFxuICAgICAgd2lkdGgsXG4gICAgfTtcbiAgICBpZiAodGhpcy5ob21lKSB7XG4gICAgICB0aGlzLmhvbWUub25SZXNpemUoeyBzaXplczogdGhpcy5zaXplcyB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogb25Ub3VjaERvd24gZm9yIGNhbnZhc1xuICAgKi9cbiAgb25Ub3VjaERvd24oZXZlbnQpIHtcbiAgICB0aGlzLmlzRG93biA9IHRydWU7XG5cbiAgICB0aGlzLnguc3RhcnQgPSBldmVudC50b3VjaGVzID8gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIDogZXZlbnQuY2xpZW50WDtcbiAgICB0aGlzLnkuc3RhcnQgPSBldmVudC50b3VjaGVzID8gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIDogZXZlbnQuY2xpZW50WTtcblxuICAgIGlmICh0aGlzLmhvbWUpIHtcbiAgICAgIHRoaXMuaG9tZS5vblRvdWNoRG93bih7IHg6IHRoaXMueC5zdGFydCwgeTogdGhpcy55LnN0YXJ0IH0pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogb25Ub3VjaE1vdmUgZm9yIGNhbnZhc1xuICAgKi9cbiAgb25Ub3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNEb3duKSByZXR1cm47XG5cbiAgICBjb25zdCB4ID0gZXZlbnQudG91Y2hlcyA/IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCA6IGV2ZW50LmNsaWVudFg7XG4gICAgY29uc3QgeSA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgOiBldmVudC5jbGllbnRZO1xuXG4gICAgdGhpcy54LmVuZCA9IHg7XG4gICAgdGhpcy55LmVuZCA9IHk7XG5cbiAgICBpZiAodGhpcy5ob21lKSB7XG4gICAgICB0aGlzLmhvbWUub25Ub3VjaE1vdmUoeyB4OiB0aGlzLngsIHk6IHRoaXMueSB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIG9uVG91Y2hVcCBmb3IgY2FudmFzXG4gICAqL1xuICBvblRvdWNoVXAoZXZlbnQpIHtcbiAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgIGNvbnN0IHggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1xuICAgICAgPyBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYXG4gICAgICA6IGV2ZW50LmNsaWVudFg7XG4gICAgY29uc3QgeSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzXG4gICAgICA/IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICAgIDogZXZlbnQuY2xpZW50WTtcblxuICAgIHRoaXMueC5lbmQgPSB4O1xuICAgIHRoaXMueS5lbmQgPSB5O1xuXG4gICAgaWYgKHRoaXMuaG9tZSkge1xuICAgICAgdGhpcy5ob21lLm9uVG91Y2hVcCh7IHg6IHRoaXMueCwgeTogdGhpcy55IH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uV2hlZWwoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5ob21lLm9uV2hlZWwpIHtcbiAgICAgIHRoaXMuaG9tZS5vbldoZWVsKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaG9tZSkge1xuICAgICAgdGhpcy5ob21lLnVwZGF0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih7IGNhbWVyYTogdGhpcy5jYW1lcmEsIHNjZW5lOiB0aGlzLnNjZW5lIH0pO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHsgY2FtZXJhOiB0aGlzLmNhbWVyYSwgc2NlbmU6IHRoaXMuc2NlbmUgfSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjhkZGVmNWVlNTgwZTQxMWZiYWI0XCIpIl0sIm5hbWVzIjpbIkNhbnZhcyIsImNvbnN0cnVjdG9yIiwidGhpcyIsIngiLCJzdGFydCIsImRpc3RhbmNlIiwiZW5kIiwieSIsImNyZWF0ZVJlbmRlcmVyIiwiY3JlYXRlQ2FtZXJhIiwiY3JlYXRlU2NlbmUiLCJvblJlc2l6ZSIsImNyZWF0ZUhvbWUiLCJyZW5kZXJlciIsIlJlbmRlcmVyIiwiYWxwaGEiLCJhbnRpYWxpYXMiLCJnbCIsImRvY3VtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY2FudmFzIiwiY2FtZXJhIiwiQ2FtZXJhIiwicG9zaXRpb24iLCJ6Iiwic2NlbmUiLCJUcmFuc2Zvcm0iLCJob21lIiwiSG9tZSIsInNpemVzIiwic2V0U2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInBlcnNwZWN0aXZlIiwiYXNwZWN0IiwiZm92IiwiTWF0aCIsIlBJIiwiaGVpZ2h0IiwidGFuIiwid2lkdGgiLCJvblRvdWNoRG93biIsImV2ZW50IiwiaXNEb3duIiwidG91Y2hlcyIsImNsaWVudFgiLCJjbGllbnRZIiwib25Ub3VjaE1vdmUiLCJvblRvdWNoVXAiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uV2hlZWwiLCJ1cGRhdGUiLCJyZW5kZXIiLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwiaCJdLCJzb3VyY2VSb290IjoiIn0=