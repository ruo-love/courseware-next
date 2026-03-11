import { get } from "lodash-es";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "@/engine/layout/layout";
import { BaseTemplate } from "../BaseTemplate";
import TFWordAudiCard from "./TFWordAudiCard";
import { Container, Graphics, Rectangle } from "pixi.js";
import ResetButton from "@/app/ui/ResetButton";
import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { loadSpineFromZip } from "@/app/utils/loadSpineFromZip";

class KJTF_Q_LTF_v2 extends BaseTemplate {
    public static assetBundles = ["KJTF_Q_LTF_v2"];
    private parseData: any = {}
    private cardContainer: Container = new Container()
    private cardContent: Container = new Container()
    private cardMask: Graphics = new Graphics()
    private maxScrollY = 0
    private resetBtn = new ResetButton()
    private wordCards:Array<TFWordAudiCard> =[]
    private titleSpine?:Spine
    private destroyTitleSpine?: () => void
    constructor(payload: unknown) {
        super(payload)
        this.parseData = this.parse(payload);
        const titleImageZipUrl = get(payload,"title_image")
        if (titleImageZipUrl) {
            void this.initTitleSpine(titleImageZipUrl)
        }
        const { optionsData } = this.parseData
        this.createWordCards(optionsData)
    }

    private async initTitleSpine(zipUrl: string) {
        const { spine, destroy } = await loadSpineFromZip(zipUrl)
        this.titleSpine = spine
        this.titleSpine.scale = 0.2
        this.destroyTitleSpine = destroy
        this.titleSpine.x = this.titleSpine.width/2
        this.titleSpine.y =  200
        this.contentLayer.addChild(this.titleSpine)
    }
    parse(data: any) {
        const payload: any = {}
        payload.questions = get(data, "exercises_data.included").find((e: any) => e.type == "questions")
        const question_resource = get(payload, "questions.relationships.resources.data[0]")
        payload.questionResource = question_resource
        payload.optionsResources = get(data, "exercises_data.included").filter((e: any) => (e.type == "resources" && payload.questionResource.id !== e.id))
        payload.options = get(data, "exercises_data.included").filter((e: any) => (e.type == "options"))
        payload.optionsData =[]
        for(let i=0; i< payload.options.length ;i++){
            const option = payload.options[i]
            const optionAudioId = get(option,"relationships.resources.data[0].id")
            const optionResource = payload.optionsResources.find((e:any)=>e.id===optionAudioId)
            const item = {
                id:optionAudioId,
                correct:get(option,"attributes.is-checked"),
                audioUrl:get(optionResource,"attributes.audio-path")
            }
            payload.optionsData.push(item)
        }
        return payload
    }

    private createWordCards(optionsData: any[] = []) {
        if (!optionsData.length) return
        this.cardContainer.removeChildren().forEach(child => child.destroy({ children: true }))
        this.cardContent = new Container()
        this.cardMask = new Graphics()
        this.contentLayer.addChild(this.resetBtn)
        this.contentLayer.addChild(this.cardContainer)
        const wordCards = optionsData.map((payload) => new TFWordAudiCard(payload))
        this.wordCards = wordCards;
        const cardWidth = wordCards[0].width
        const cardHeight = wordCards[0].height
        const horizontalPadding = 10
        const availableWidth = DESIGN_WIDTH - horizontalPadding * 2
        const rowGap = 32
        const cardWiewportHeight = 500

        let columns = 1
        if (optionsData.length === 2) {
            columns = 2
        } else if (optionsData.length >= 3 && optionsData.length <= 4) {
            columns = optionsData.length
        } else if (optionsData.length >= 5 && optionsData.length <= 6) {
            columns = 3
        } else if (optionsData.length >= 7) {
            columns = 4
        }

        const rowCount = Math.ceil(optionsData.length / columns)
        const totalHeight = rowCount * cardHeight + (rowCount - 1) * rowGap
        const startY = totalHeight < cardWiewportHeight ? (cardWiewportHeight - totalHeight) / 2 : 0

        this.cardContainer.position.set(0, DESIGN_HEIGHT - cardWiewportHeight - 50)
        this.cardContainer.eventMode = "static"
        this.cardContainer.hitArea = new Rectangle(0, 0, DESIGN_WIDTH, cardWiewportHeight)
        this.cardContainer.off("wheel", this.onCardWheel, this)
        this.cardContainer.on("wheel", this.onCardWheel, this)

        this.cardMask.rect(0, 0, DESIGN_WIDTH, cardWiewportHeight).fill(0xffffff)
        this.cardContainer.addChild(this.cardMask)
        this.cardContainer.addChild(this.cardContent)
        this.cardContent.mask = this.cardMask
        this.cardContent.y = 0
        this.maxScrollY = Math.max(0, totalHeight - cardWiewportHeight)

        for (let row = 0; row < rowCount; row++) {
            const startIndex = row * columns
            const endIndex = Math.min(startIndex + columns, wordCards.length)
            const currentRowCards = wordCards.slice(startIndex, endIndex)
            const currentColumns = currentRowCards.length
            const columnWidth = availableWidth / currentColumns

            for (let column = 0; column < currentColumns; column++) {
                const wordCard = currentRowCards[column]
                wordCard.x = horizontalPadding + columnWidth * column + (columnWidth - cardWidth) / 2
                wordCard.y = startY + row * (cardHeight + rowGap)
                this.cardContent.addChild(wordCard)
            }
        }
        this.resetBtn.y = DESIGN_HEIGHT - cardWiewportHeight - 100
        this.resetBtn.x = this.cardContainer.width
        this.resetBtn.eventMode = "static"
        this.resetBtn.cursor = "pointer"
        this.resetBtn.on("pointertap",()=>{
            this.reset()
        })
    }

    private onCardWheel(event: any) {
        if (this.maxScrollY <= 0) return
        const deltaY = event.deltaY ?? 0
        const nextY = this.cardContent.y - deltaY * 0.3
        this.cardContent.y = Math.min(0, Math.max(-this.maxScrollY, nextY))
    }

    public reset() { 
        this.wordCards.forEach(e=>{
            e.reset()
        })
    }

    public destroyTemplate() {
        this.cardContainer.off("wheel", this.onCardWheel, this)
        this.destroyTitleSpine?.()
        this.removeChildren();
        this.destroy({ children: true });
    }
}

export default KJTF_Q_LTF_v2;
