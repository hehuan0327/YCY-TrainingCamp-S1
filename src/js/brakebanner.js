/*
 * @Author: hehuan
 * @Date: 2022-07-26 10:18:31
 * @LastEditors: hehuan
 * @LastEditTime: 2022-07-28 14:15:32
 * @Description: ''
 */
class BrakeBanner {
	constructor(selector) {
		// 初始化PIXI应用，将舞台设置为1920x1080
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		})
		document.querySelector(selector).appendChild(this.app.view);
		this.stage = new PIXI.Container();
		this.stage.sortableChildren = true
		this.app.stage.addChild(this.stage);
		// 创建资源加载器
		this.loader = new PIXI.Loader();
		// 向资源加载器添加资源 key,path
		this.loader.add('btn.png', 'images/btn.png');
		this.loader.add('btn_circle.png', 'images/btn_circle.png');
		this.loader.add('brake_bike.png', 'images/brake_bike.png');
		this.loader.add('brake_handlerbar.png', 'images/brake_handlerbar.png');
		this.loader.add('brake_lever.png', 'images/brake_lever.png');
		this.loader.load();
		this.loader.onComplete.add(() => {
			this.show();
		})
	}
	show(){
		const createActionButton = () => {
			const btnContainer = new PIXI.Container();
			this.stage.addChild(btnContainer);

			// 通过图片创建精灵元素
			const btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture);
			btnContainer.addChild(btnImage);

			const btnCircleImage = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
			btnContainer.addChild(btnCircleImage)

			// 转换中心点设置
			btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
			btnCircleImage.pivot.x = btnCircleImage.pivot.y = btnCircleImage.width / 2;

			btnContainer.x = 200;
			btnContainer.y = 200;

			btnCircleImage.scale.x = btnCircleImage.scale.y = .8;

			gsap.to(btnCircleImage, { duration: 1, alpha: 0, repeat: -1 });
			gsap.to(btnCircleImage.scale, { duration: 1, x: 1.1, y: 1.1, repeat: -1 })

			return btnContainer
		}
		let actionBtn = createActionButton();
		actionBtn.zIndex = 3
		actionBtn.buttonMode = true;
		actionBtn.interactive = true;

		actionBtn.x = actionBtn.y = 400
		const bikeContainer = new PIXI.Container();
		this.stage.addChild(bikeContainer);

		// 整体进行一个缩放
		bikeContainer.scale.x = bikeContainer.scale.y = .3;
		bikeContainer.zIndex = 3

		const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture);
		bikeContainer.addChild(bikeImage)

		const bikeHanderImage = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture);
		bikeContainer.addChild(bikeHanderImage)

		const bikeLeverImage = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture);
		bikeContainer.addChild(bikeLeverImage)

		bikeLeverImage.x = 255 + 454;
		bikeLeverImage.y = 450 + 462;

		bikeLeverImage.pivot.x = 454;
		bikeLeverImage.pivot.y = 462;

		bikeLeverImage.rotation = 0;

		let particleZoneSize = window.innerWidth;
		let particlesContainer = new PIXI.Container();
		this.stage.addChild(particlesContainer);
		let particles = [];
		const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
		for (let i = 0; i < 10; i++) {
			let gr = new PIXI.Graphics();
			gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
			gr.drawCircle(0, 0, 6);
			gr.endFill();

			let parItem = {
				sx: Math.random() * particleZoneSize,
				sy: Math.random() * particleZoneSize,
			}

			gr.x = parItem.sx;
			gr.y = parItem.sy;
			gr.zIndex = 1
			particles.push({...parItem,gr})

			particlesContainer.addChild(gr);
		}

		particlesContainer.pivot.set(particleZoneSize / 2, particleZoneSize / 2);
		particlesContainer.rotation = (35 * Math.PI) / 180;
		particlesContainer.x = particleZoneSize / 2;
		particlesContainer.y = particleZoneSize / 2;


		let speed = 0
		function loop() {
			speed += .5;
			speed = Math.min(speed, 20);
			for (let i = 0; i < particles.length; i++) {
				//拿到粒子item和小圆点实例
				let pItem = particles[i];
				let gr = pItem.gr;

				//让粒子走起来
				gr.y += speed;
				if (speed >= 20) {
					gr.scale.y = 40;
					gr.scale.x = 0.03
				}
				//当粒子移动超出范围时回到顶部
				if (gr.y > innerWidth) gr.y = 0;
			}
		}
		function start() {
			speed = 0
			gsap.ticker.add(loop);
		}
		function pause() {
			//先移除掉requestAnimationFrame的侦听
			gsap.ticker.remove(loop);

			for (let i = 0; i < particles.length; i++) {
				let pItem = particles[i];
				let gr = pItem.gr;

				//恢复小圆点的拉伸比例
				gr.scale.x = gr.scale.y = 1;
				//恢复小圆点透明度
				gr.alpha = 1;
				//让所有的小圆点使用弹性补间动画回到初始坐标
				gsap.to(gr, {
					duration: 0.6,
					x: pItem.sx,
					y: pItem.sy,
					ease: "elastic.out",
				});
			}
		}

		start()

		actionBtn.on("mousedown", () => {
			bikeLeverImage.rotation = Math.PI / 180 * -35;
			gsap.to(bikeLeverImage, { duration: .6, rotation: Math.PI / 180 * -35 });
			pause()
		})
		actionBtn.on("mouseup", () => {
			bikeLeverImage.rotation = 0;
			gsap.to(bikeLeverImage, { duration: .6, rotation: 0 });
			start()
		})

		let resize = () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
		}
		window.addEventListener('resize', resize);
		resize();
	}
}