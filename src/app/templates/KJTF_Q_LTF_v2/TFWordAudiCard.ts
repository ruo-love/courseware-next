import { engine } from "@/app/getEngine";
import { createFrameTexture } from "@/app/utils/createFrameTexture";
import { sound } from "@pixi/sound";
import { Container, NineSliceSprite, Sprite, Text, TextStyleOptions } from "pixi.js";

interface TFWordAudiCardData{
    id:string
    audioUrl:string
    correct:boolean
}

class TFWordAudiCard extends Container {
    private panel: NineSliceSprite
    private audioIcon:Sprite
    private TIcon:Container
    private FIcon:Container
    private tIconBg:Sprite
    private fIconBg:Sprite
    private TLabel:Text
    private FLabel:Text
    private data:TFWordAudiCardData
    private size=78
    private status:"empty"|"selected" = "empty"
    private textureMap = new Map()
    constructor(data:TFWordAudiCardData) {
        super()
        this.data= data;
        const soundName=`TFWordAudiCard-${data.id}`
        sound.add(soundName, {url: data.audioUrl});
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
        this.audioIcon.eventMode = "static"
        this.audioIcon.cursor = "pointer"
        this.audioIcon.on("pointertap", async () => {
            engine().audio.sfx.play(soundName);
        });
        this.panel.addChild(this.audioIcon)

        //T button
        const defaultTexture = createFrameTexture("card.png", {
            x: 295,
            y: 268,
            w: this.size,
            h: this.size,
        });

        const rightTexture = createFrameTexture("card.png", {
                x: 378,
                y: 268,
                w: this.size,
                h: this.size,
        });
        const errorTexture = createFrameTexture("card.png", {
                x: 350,
                y: 351,
                w: this.size,
                h: this.size,
        });
        this.textureMap.set("default",defaultTexture)
        this.textureMap.set("right",rightTexture)
        this.textureMap.set("error",errorTexture)

        this.TIcon = new Container()
        this.TIcon.x = 17
        this.TIcon.y = this.audioIcon.height+30
        this.tIconBg = new Sprite(defaultTexture)
        this.TIcon.addChild(this.tIconBg)
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
        this.TLabel.x = this.size / 2
        this.TLabel.y = this.size / 2
        this.TIcon.addChild(this.TLabel)
        this.TIcon.eventMode = "static"
        this.TIcon.cursor = "pointer"
        this.panel.addChild(this.TIcon)
        this.TIcon.on("pointerdown", ()=>{
            this.handleTFDown(true)
        });
        this.TIcon.on("pointertap", ()=>{
            this.handleTFTap(true)
        });


        //F button
        this.FIcon = new Container()
        this.FIcon.x = 17+this.TIcon.width+7
        this.FIcon.y = this.audioIcon.height+30
        this.fIconBg = new Sprite(defaultTexture)
        this.FIcon.addChild(this.fIconBg)
        this.FLabel = new Text({
            text: "F",
            style
        })
        this.FLabel.anchor.set(0.5)
        this.FLabel.x = this.size / 2
        this.FLabel.y = this.size / 2
        this.FIcon.addChild(this.FLabel)
        this.FIcon.eventMode = "static"
        this.FIcon.cursor = "pointer"
        this.panel.addChild(this.FIcon)
        this.FIcon.on("pointerdown", ()=>{
            this.handleTFDown(false)
        });

        this.FIcon.on("pointertap", ()=>{
            this.handleTFTap(false)
        });
    }

    /**
     * 判断正确
     */
    handleTFTap(value:boolean) {
        if(this.status==="selected") return
        this.status = "selected"
        const tIconBg = value?this.tIconBg:this.fIconBg
        if(this.data.correct===value){
            //选择正确
            
            tIconBg.texture = this.textureMap.get("right")
            engine().audio.sfx.play("templates/KJTF_Q_LTF_v2/sounds/correct.mp3")
        }else{
            //选择错误
          
            tIconBg.texture = this.textureMap.get("error")
            engine().audio.sfx.play("templates/KJTF_Q_LTF_v2/sounds/wrong.mp3",{
                complete:()=>{
                    engine().audio.sfx.play("templates/KJTF_Q_LTF_v2/sounds/show_correct.mp3")
                }
            })
        }
    }
    
    handleTFDown(value:boolean){
        if(this.status==="selected") return
        const targetBg = value ? this.tIconBg : this.fIconBg
        targetBg.texture = this.textureMap.get("right")
    }

    reset(){
        this.status = "empty"
        this.fIconBg.texture = this.textureMap.get("default")
        this.tIconBg.texture = this.textureMap.get("default")
    }

}

export default TFWordAudiCard;
