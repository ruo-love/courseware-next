import { get } from "lodash-es";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "@/engine/layout/layout";
import { BaseTemplate } from "../BaseTemplate";
import TFWordAudiCard from "./TFWordAudiCard";
import { Container, Graphics, Rectangle } from "pixi.js";

class KJTF_Q_LTF_v2 extends BaseTemplate {
    public static assetBundles = ["KJTF_Q_LTF_v2"];
    private parseData: any = {}
    private cardContainer: Container = new Container()
    private cardContent: Container = new Container()
    private cardMask: Graphics = new Graphics()
    private maxScrollY = 0
    constructor() {
        super()
    }
    public init(data: unknown) {
        this.parseData = this.parse(data);
        const { questionResources } = this.parseData
        this.contentLayer.removeChildren().forEach(child => child.destroy({ children: true }))
        this.createWordCards([...questionResources, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 8]) //mock
    }
    parse(data: any) {
        const payload: any = {}
        payload.questions = get(data, "exercises_data.included").find((e: any) => e.type == "questions")
        const question_resource = get(payload, "questions.relationships.resources.data[0]")
        payload.question_resource = question_resource
        payload.questionResources = get(data, "exercises_data.included").filter((e: any) => (e.type == "resources" && payload.question_resource.id !== e.id))
        payload.options = get(data, "exercises_data.included").filter((e: any) => (e.type == "options"))
        return payload
    }

    private createWordCards(questionResources: any[] = []) {
        if (!questionResources.length) return
        this.cardContainer.removeChildren().forEach(child => child.destroy({ children: true }))
        this.cardContent = new Container()
        this.cardMask = new Graphics()
        this.contentLayer.addChild(this.cardContainer)

        const wordCards = questionResources.map(() => new TFWordAudiCard())
        const cardWidth = wordCards[0].width
        const cardHeight = wordCards[0].height
        const horizontalPadding = 80
        const availableWidth = DESIGN_WIDTH - horizontalPadding * 2
        const rowGap = 32
        const cardWiewportHeight = 500

        let columns = 1
        if (questionResources.length === 2) {
            columns = 2
        } else if (questionResources.length >= 3 && questionResources.length <= 4) {
            columns = questionResources.length
        } else if (questionResources.length >= 5 && questionResources.length <= 6) {
            columns = 3
        } else if (questionResources.length >= 7) {
            columns = 4
        }

        const rowCount = Math.ceil(questionResources.length / columns)
        const totalHeight = rowCount * cardHeight + (rowCount - 1) * rowGap
        const startY = totalHeight < cardWiewportHeight ? (cardWiewportHeight - totalHeight) / 2 : 0

        this.cardContainer.position.set(0, DESIGN_HEIGHT - cardWiewportHeight - 40)
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
    }

    private onCardWheel(event: any) {
        if (this.maxScrollY <= 0) return
        const deltaY = event.deltaY ?? 0
        const nextY = this.cardContent.y - deltaY * 0.3
        this.cardContent.y = Math.min(0, Math.max(-this.maxScrollY, nextY))
    }

    public reset() { }

    public destroyTemplate() {
        this.cardContainer.off("wheel", this.onCardWheel, this)
        this.removeChildren();
        this.destroy({ children: true });
    }
}

export default KJTF_Q_LTF_v2;
