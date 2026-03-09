import { Container, Sprite } from "pixi.js";

import { createFrameTexture } from "../../utils/createFrameTexture";

export default class Ctrs extends Container {
    private teacherTipsBtn: Sprite;
    private navigationBarBtn: Sprite;
    private backPageBtn: Sprite;
    private nextPageBtn: Sprite;

    constructor() {
        super();
        const size = 60;
        const gap = 10;
        // 这里的坐标先随便写，你后面再改
        const teacherTipsTexture = createFrameTexture("common/tool-bar.png", {
            x: 3,
            y: 2,
            w: size,
            h: size,
        });
        const navigationBarTexture = createFrameTexture("common/tool-bar.png", {
            x: 196,
            y: 2,
            w: size,
            h: size,
        });
        const backPageTexture = createFrameTexture("common/tool-bar.png", {
            x: 132,
            y: 2,
            w: size,
            h: size,
        });
        const nextPageTexture = createFrameTexture("common/tool-bar.png", {
            x: 132,
            y: 132,
            w: size,
            h: size,
        });
        this.teacherTipsBtn = new Sprite(teacherTipsTexture);
        this.navigationBarBtn = new Sprite(navigationBarTexture);
        this.backPageBtn = new Sprite(backPageTexture);
        this.nextPageBtn = new Sprite(nextPageTexture);

        this.teacherTipsBtn.width = size;
        this.teacherTipsBtn.height = size;

        this.navigationBarBtn.width = size;
        this.navigationBarBtn.height = size;

        this.backPageBtn.width = size;
        this.backPageBtn.height = size;

        this.nextPageBtn.width = size;
        this.nextPageBtn.height = size;

        this.teacherTipsBtn.eventMode = "static";
        this.navigationBarBtn.eventMode = "static";
        this.backPageBtn.eventMode = "static";
        this.nextPageBtn.eventMode = "static";

        this.teacherTipsBtn.cursor = "pointer";
        this.navigationBarBtn.cursor = "pointer";
        this.backPageBtn.cursor = "pointer";
        this.nextPageBtn.cursor = "pointer";

        // 水平排列
        this.teacherTipsBtn.x = 0;
        this.navigationBarBtn.x = size + gap;
        this.backPageBtn.x = (size + gap) * 2;
        this.nextPageBtn.x = (size + gap) * 3;

        this.addChild(
            this.teacherTipsBtn,
            this.navigationBarBtn,
            this.backPageBtn,
            this.nextPageBtn,
        );
    }
}
