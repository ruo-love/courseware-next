import type { BaseTemplate } from "./BaseTemplate";

type TemplateCtor = new () => BaseTemplate;

export class TemplateFactory {
  private static registry = new Map<string, TemplateCtor>();

  public static register(type: string, ctor: TemplateCtor) {
    this.registry.set(type, ctor);
  }

  public static create(type: string): BaseTemplate {
    const ctor = this.registry.get(type);
    if (!ctor) {
      throw new Error(`Unknown template type: ${type}`);
    }
    return new ctor();
  }
}

