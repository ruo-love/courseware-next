import { BaseTemplate } from "../BaseTemplate";

class KJTF_Q_LTF_v2 extends BaseTemplate {
    public init(data: unknown) {
        const payload = data;
        console.log(payload)
    }

    public reset() { }

    public destroyTemplate() {
        this.removeChildren();
        this.destroy({ children: true });
    }
}

export default KJTF_Q_LTF_v2;