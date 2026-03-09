# courseware-next

基于 `PixiJS + Vite + TypeScript` 的课件模板项目。

当前项目已经从 Pixi 官方模板调整为“页面壳 + 题型模板”的结构，适合继续扩展选择题、判断题、语音题、拖拽题等课件题型。

当前已接入：

- `LoadScreen` 加载页
- `TemplateScreen` 题目页
- `BaseScreen + Navigation` 页面管理
- `BaseTemplate + TemplateFactory` 模板管理
- 模板级 `assetBundles` 资源加载

当前未接入：

- 统一答案提交流程
- 报告页跳转与报告汇总
- 后端接口对接

## 快速开始

安装依赖：

```bash
yarn
```

启动开发环境：

```bash
yarn dev
```

默认行为：

- 本地端口：`8080`
- 自动打开浏览器
- `raw-assets` 变化会通过 `AssetPack` 自动生成运行资源

代码检查：

```bash
yarn lint
```

构建：

```bash
yarn build:beta
yarn build:prod
```

## 目录概览

```text
.
├── docs/                 开发文档
├── public/               静态资源输出目录
├── raw-assets/           原始资源目录
├── scripts/              构建辅助脚本
├── src/
│   ├── app/
│   │   ├── popups/       弹窗
│   │   ├── screens/      页面
│   │   ├── templates/    题型模板
│   │   ├── ui/           通用 UI 组件
│   │   └── utils/        业务工具
│   ├── engine/           引擎层封装
│   ├── main.ts           启动入口
│   └── manifest.json     AssetPack 生成的资源清单
├── vite.config.ts
└── package.json
```

## 核心结构

页面层：

- 页面统一继承 `BaseScreen`
- 页面切换由 `Navigation` 管理
- 当前主流程是 `LoadScreen -> TemplateScreen`

模板层：

- 模板统一继承 `BaseTemplate`
- 模板通过 `TemplateFactory.register(type, ctor)` 注册
- `TemplateScreen` 根据题目 `type` 创建模板
- 如果模板声明了静态 `assetBundles`，切题时会先加载对应资源

## 新增一个模板

1. 在 `src/app/templates/` 下创建模板目录和模板类
2. 继承 `BaseTemplate`
3. 按需声明静态 `assetBundles`
4. 在 `src/main.ts` 中注册模板

示例：

```ts
export class ChoiceTemplate extends BaseTemplate {
  public static override assetBundles = ["template-choice"];

  public init(data: unknown) {}
  public reset() {}
  public destroyTemplate() {}
}
```

```ts
TemplateFactory.register("choice", ChoiceTemplate);
```

## 资源说明

资源入口在 `raw-assets/`。

资源链路：

`raw-assets` -> `AssetPack` -> `public/assets` + `src/manifest.json`

目录名里的 `{m}`、`{tps}` 是 `AssetPack` 的 tag 写法，不是最终 bundle 名本身。例如 `raw-assets/main{m}` 的 bundle 名是 `main`，`m` 只是标签。

## 开发文档

更详细的说明见 [docs/dev.md](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/docs/dev.md)。
