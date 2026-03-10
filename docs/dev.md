# 课件项目开发文档

## 1. 项目简介

这是一个基于 `PixiJS + Vite + TypeScript` 的课件模板项目。

当前项目已经从 Pixi 官方模板演进为“课件壳 + 题型模板”的结构：

- 页面层使用 `BaseScreen + Navigation`
- 题型层使用 `BaseTemplate + TemplateFactory`
- 资源通过 `AssetPack` 从 `raw-assets` 生成到运行时资源清单

当前启动流程：

`LoadScreen` -> `TemplateScreen`

当前项目还没有接入答案提交和报告页跳转流程。

入口文件是 [src/main.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/main.ts)。

## 2. 目录结构

### 根目录

- `docs/`
  开发文档目录。

- `public/`
  Vite 静态资源目录，浏览器直接可访问。`AssetPack` 也会把处理后的资源输出到这里的 `assets` 子目录。

- `raw-assets/`
  原始资源目录。美术、音频等源文件放这里，开发和构建时会自动生成资源清单。

- `scripts/`
  构建辅助脚本。当前主要是 `assetpack-vite-plugin.ts`，负责把 `raw-assets` 转成 Pixi 可直接使用的资源。

- `src/`
  业务源码目录。

- `vite.config.ts`
  Vite 配置。当前开发端口是 `8080`，启动时会自动打开浏览器。

- `package.json`
  项目脚本和依赖定义。

### `src` 目录

- `src/main.ts`
  启动入口。负责初始化 `CreationEngine`、注册模板、进入首屏。

- `src/engine/`
  引擎层封装。

- `src/engine/engine.ts`
  Pixi `Application` 的包装，初始化画布、资源、插件。

- `src/engine/navigation/`
  页面管理层。

- `src/engine/navigation/BaseScreen.ts`
  所有页面和弹窗的抽象基类，统一 `resize / show / hide / update` 生命周期。

- `src/engine/navigation/navigation.ts`
  页面切换控制器，负责 `showScreen`、`presentPopup`、`dismissPopup`。

- `src/engine/layout/`
  布局计算层。统一维护设计稿尺寸和页面缩放结果。

- `src/engine/layout/layout.ts`
  当前全局设计稿尺寸定义为 `1024x768`，并输出 `ScreenLayout`。

- `src/engine/audio/`
  音频插件与音频管理。

- `src/engine/resize/`
  画布缩放与自适应逻辑。

- `src/app/screens/`
  常规页面。
  当前包括加载页 `LoadScreen`、题目页 `TemplateScreen`，以及预留中的 `ReportScreen`。

- `src/app/popups/`
  弹窗页面。
  当前包括暂停弹窗、设置弹窗。

- `src/app/templates/`
  题型模板层。

- `src/app/templates/BaseTemplate.ts`
  题型抽象基类，约束模板的初始化、重置、销毁逻辑。

- `src/app/templates/TemplateFactory.ts`
  模板工厂。根据 `type` 创建具体题型实例。

- `src/app/templates/choice/`
  选择题模板。

- `src/app/templates/trueFalse/`
  判断题模板。

- `src/app/ui/`
  通用 UI 组件，如按钮、文本、圆角底板、控制按钮。

- `src/app/utils/`
  应用侧工具函数与本地设置。

- `src/manifest.json`
  由 `AssetPack` 自动生成的资源清单文件，通常不要手改。

## 3. 页面与模板关系

当前项目分两层：

### 页面层

页面层负责流程控制，比如：

- 进入加载页
- 进入题目页
- 切换题目
- 打开暂停/设置弹窗

页面统一继承 [src/engine/navigation/BaseScreen.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/engine/navigation/BaseScreen.ts)。

### 模板层

模板层负责具体题型内容，比如：

- 选择题
- 判断题
- 以后扩展语音题、拖拽题、战斗题

模板统一继承 [src/app/templates/BaseTemplate.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/app/templates/BaseTemplate.ts)。

当前设计原则是：

- 模板内部只负责题目内容渲染与交互
- 当前只接入了题目切换，没有答案提交和报告汇总流程

## 4. 布局规则

当前项目统一采用：

- 固定设计稿尺寸：`1024x768`
- 内容缩放模式：`contain / showAll`
- 浏览器变化时，由框架层统一计算缩放和居中偏移

布局计算定义在 [src/engine/layout/layout.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/engine/layout/layout.ts)。

### `ScreenLayout` 含义

所有页面的 `resize()` 不再直接接收裸 `width / height`，而是接收 `ScreenLayout`：

- `viewportWidth / viewportHeight`
  当前浏览器可视区域大小。

- `designWidth / designHeight`
  固定设计稿大小，当前恒定为 `1024 / 768`。

- `scale`
  设计稿缩放到当前页面时的等比缩放值。

- `offsetX / offsetY`
  设计稿内容在页面中的居中偏移。

### `BaseScreen` 三层结构

所有页面和弹窗统一继承 [src/engine/navigation/BaseScreen.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/engine/navigation/BaseScreen.ts)，默认带 3 层：

- `backgroundLayer`
  全屏层，直接按 `viewportWidth / viewportHeight` 布局。
  适合放铺满页面的背景图、全屏遮罩、全屏动效底图。

- `contentLayer`
  设计稿内容层，由 `applyLayout(layout)` 自动套用 `1024x768` 的缩放和居中。
  适合放题目主体、弹窗面板、主要业务 UI。

- `overlayLayer`
  视口固定层，直接按页面真实像素布局。
  适合放右上角按钮、浮动控制器、角标、悬浮入口。

### 开发规则

写页面时，优先按下面的规则放元素：

- 需要铺满整个浏览器区域的元素，放 `backgroundLayer`
- 需要跟随设计稿整体缩放的元素，放 `contentLayer`
- 需要固定在页面边缘的元素，放 `overlayLayer`

不要再在页面里手动写这类“反算缩放”的公式：

```ts
-offsetX / scale
viewportWidth / scale
1 / scale
```

这类写法只适合作为临时补丁，不应作为长期布局方案。

### 标准写法示例

参考 [src/app/screens/LoadScreen.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/app/screens/LoadScreen.ts)：

- `bg` 放在 `backgroundLayer`，直接铺满页面
- `cover` 和 `click_start` 放在 `contentLayer`，按 `1024x768` 设计稿布局
- `ctr` 放在 `overlayLayer`，固定在右上角

典型写法：

```ts
public resize(layout: ScreenLayout) {
  this.applyLayout(layout);

  this.bg.width = layout.viewportWidth;
  this.bg.height = layout.viewportHeight;

  this.panel.x = layout.designWidth * 0.5;
  this.panel.y = layout.designHeight * 0.5;

  this.ctr.x = layout.viewportWidth - 40 - this.ctr.width;
  this.ctr.y = 40;
}
```

### 模板层规则

[src/app/templates/BaseTemplate.ts](/Users/qiancheng.zhao/Desktop/work/pixi/courseware-next/src/app/templates/BaseTemplate.ts) 代表题型内容本身。

当前约定：

- 模板实例默认挂到页面的 `contentLayer`
- 模板内部按设计稿坐标开发
- 模板不要自己处理浏览器级缩放
- 如果模板里确实需要“固定在屏幕角落”的 UI，应由页面层提供 `overlayLayer` 承载，而不是直接在模板里反算位置

## 5. 运行方式

### 安装依赖

如果本地还没装依赖，先执行：

```bash
yarn
```

如果你使用 `npm`，也可以执行：

```bash
npm install
```

### 启动开发环境

推荐：

```bash
yarn dev
```

等价命令：

```bash
npm run dev
```

启动后：

- 本地开发端口默认是 `8080`
- 浏览器会自动打开
- `raw-assets` 资源会被 `AssetPack` 监听并自动生成

### 代码检查

```bash
yarn lint
```

### 构建

测试环境构建：

```bash
yarn build:beta
```

正式环境构建：

```bash
yarn build:prod
```

## 6. 资源处理说明

资源开发时主要操作 `raw-assets/`，不要直接维护运行产物。

当前资源链路是：

`raw-assets` -> `AssetPack` -> `public/assets` + `src/manifest.json`

其中：

- `raw-assets` 存原始资源
- `src/manifest.json` 给 Pixi `Assets.init()` 使用
- 页面和模板通过资源名加载贴图、音频
- 模版资源请统一放在独立的文件夹中：raw-assets/templates

## 7. 常见开发入口

### 新增一个页面

1. 在 `src/app/screens/` 下新增页面类
2. 继承 `BaseScreen`
3. 在构造函数中按职责把元素放进 `backgroundLayer / contentLayer / overlayLayer`
4. 实现 `resize(layout: ScreenLayout)`
5. 通过 `engine.navigation.showScreen(...)` 进入

### 新增一个题型模板

1. 在 `src/app/templates/` 下新增模板目录
2. 继承 `BaseTemplate`
3. 如有模板专属资源，在模板类上声明静态 `assetBundles`
4. 在 `src/main.ts` 中通过 `TemplateFactory.register(type, TemplateClass)` 注册
5. 在题目数据中使用对应的 `type`

## 8. 当前开发建议

当前项目已经有基础壳，但还处在模板化早期阶段。后续建议优先完善这三件事：

1. 把题目数据从 `TemplateScreen` 中拆出，独立成配置或接口数据
2. 明确模板的状态接口，例如选中项、作答结果、重置行为
3. 再决定是否需要接入统一的提交与报告流程
