import type { BaseTemplate } from "./BaseTemplate";

export interface TemplateCtor {
  new (payload?: unknown): BaseTemplate;
  assetBundles?: string[];
}

export class TemplateFactory {
  private static registry = new Map<string, TemplateCtor>();

  public static register(type: string, ctor: TemplateCtor) {
    this.registry.set(type, ctor);
  }

  public static create(type: string, payload?: unknown): BaseTemplate {
    return new (this.getCtor(type))(payload);
  }

  public static getCtor(type: string): TemplateCtor {
    const ctor = this.registry.get(type);
    if (!ctor) {
      return this.registry.get("KJTF_Q_LTF_v2")!
      // throw new Error(`Unknown template type: ${type}`);
    }
    return ctor;
  }
}
