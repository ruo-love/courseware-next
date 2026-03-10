import { createFrameTexture } from "@/app/utils/createFrameTexture";
import { Container, NineSliceSprite, Sprite, Text, TextStyleOptions } from "pixi.js";

interface TFWordAudiCardData{
    audioUrl:string
    correct:boolean
}
class TFWordAudiCard extends Container {
    private panel: NineSliceSprite
    private audioIcon:Sprite
    private TIcon:Container
    private FIcon:Container
    private TLabel:Text
    private FLabel:Text
    private data:TFWordAudiCardData
    constructor(data:TFWordAudiCardData) {
        super()
        this.data= data;
        console.log(this.data)
        const texture = createFrameTexture("card.png", {
            x: 195,
            y: 368,
            w: 150,
            h: 80
        })
        //卡片背景
        this.panel = new NineSliceSprite({
            texture,
            leftWidth: 30,
            topHeight: 30,
            rightWidth: 30,
            bottomHeight: 30
        });
        this.panel.width = 196;
        this.panel.height = 206;
        this.addChild(this.panel)

        //音频icon 后面替换为动画
        this.audioIcon = Sprite.from("audio.png")
        this.audioIcon.setSize(60)
        this.audioIcon.anchor.set(0.5)
        this.audioIcon.x = this.panel.width/2
        this.audioIcon.y = this.audioIcon.height/2+10
        this.panel.addChild(this.audioIcon)
        const size = 78;

        //TF icon
        const TFIconTexture = createFrameTexture("card.png", {
            x: 295,
            y: 268,
            w: size,
            h: size,
        });
        this.TIcon = new Container()
        this.TIcon.x = 17
        this.TIcon.y = this.audioIcon.height+30
        const tIconBg = new Sprite(TFIconTexture)
        this.TIcon.addChild(tIconBg)
        const style:TextStyleOptions = {
                fill: 0x000,
                fontSize: 42,
                "fontFamily": "\"Trebuchet MS\", Helvetica, sans-serif",
                fontWeight: "500"
            }
        this.TLabel = new Text({
            text: "T",
            style
        })
        this.TLabel.anchor.set(0.5)
        this.TLabel.x = size / 2
        this.TLabel.y = size / 2
        this.TIcon.addChild(this.TLabel)
        this.panel.addChild(this.TIcon)

        this.FIcon = new Container()
        this.FIcon.x = 17+this.TIcon.width+7
        this.FIcon.y = this.audioIcon.height+30
        const fIconBg = new Sprite(TFIconTexture)
        this.FIcon.addChild(fIconBg)
        this.FLabel = new Text({
            text: "F",
            style
        })
        this.FLabel.anchor.set(0.5)
        this.FLabel.x = size / 2
        this.FLabel.y = size / 2
        this.FIcon.addChild(this.FLabel)
        this.panel.addChild(this.FIcon)


    }
  
}

export default TFWordAudiCard;
