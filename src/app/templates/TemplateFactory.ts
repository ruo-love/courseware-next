import type { BaseTemplate } from "./BaseTemplate";

export interface TemplateCtor {
  new (): BaseTemplate;
  assetBundles?: string[];
}

export class TemplateFactory {
  private static registry = new Map<string, TemplateCtor>();

  public static register(type: string, ctor: TemplateCtor) {
    this.registry.set(type, ctor);
  }

  public static create(type: string): BaseTemplate {
    return new (this.getCtor(type))();
  }

  public static getCtor(type: string): TemplateCtor {
    const ctor = this.registry.get(type);
    if (!ctor) {
      throw new Error(`Unknown template type: ${type}`);
    }
    return ctor;
  }
}
