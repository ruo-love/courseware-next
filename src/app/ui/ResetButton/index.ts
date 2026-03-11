import { createFrameTexture } from "@/app/utils/createFrameTexture";
import { Container, Sprite } from "pixi.js";

export default class ResetButton extends Container{
    private resetButton:Sprite
    constructor(){
        super()
        const texture = createFrameTexture("common/ctr.png", {
            x: 2,
            y: 158,
            w: 104,
            h: 106,
        });
        const textureSelected = createFrameTexture("common/ctr.png", {
            "x":2,"y":394,"w":104,"h":106
        });
        this.resetButton = new Sprite(texture)
        this.resetButton.setSize(40)
        this.resetButton.eventMode = "static"
        this.resetButton.cursor = "pointer"
        this.resetButton.on("pointerdown", ()=>{
            this.resetButton.texture = textureSelected
        });
        this.resetButton.on("pointerup", ()=>{
            this.resetButton.texture = texture
        });
        this.resetButton.on("pointerleave", ()=>{
            this.resetButton.texture = texture
        });
        this.addChild(this.resetButton)
    }
}