import { Assets, BigPool, Container } from "pixi.js";

import type { CreationEngine } from "../engine";
import {
  createScreenLayout,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  type ScreenLayout,
} from "../layout/layout";

import type { BaseScreen } from "./BaseScreen";

/** Interface for app screens constructors */
interface AppScreenConstructor {
  new (): BaseScreen;
  /** List of assets bundles required by the screen */
  assetBundles?: string[];
}

export class Navigation {
  /** Reference to the main application */
  public app!: CreationEngine;

  /** Root container mounted to stage */
  public root = new Container();

  /** Fixed design-space container for screens */
  public container = new Container();

  /** Application width */
  public width = 0;

  /** Application height */
  public height = 0;

  /** Current layout snapshot */
  public layout: ScreenLayout = createScreenLayout(DESIGN_WIDTH, DESIGN_HEIGHT);

  /** Constant background view for all screens */
  public background?: BaseScreen;

  /** Current screen being displayed */
  public currentScreen?: BaseScreen;

  /** Current popup being displayed */
  public currentPopup?: BaseScreen;

  public init(app: CreationEngine) {
    this.app = app;
    this.root.addChild(this.container);
  }

  /** Set the  default load screen */
  public setBackground(ctor: AppScreenConstructor) {
    this.background = new ctor();
    this.addAndShowScreen(this.background);
  }

  /** Add screen to the stage, link update & resize functions */
  private async addAndShowScreen(screen: BaseScreen) {
    // Add navigation container to stage if it does not have a parent yet
    if (!this.root.parent) {
      this.app.stage.addChild(this.root);
    }

    // Add screen to stage
    this.container.addChild(screen);

  
    // Add screen's resize handler, if available
    // Trigger a first resize
    screen.resize(this.layout);

    // Setup things and pre-organise screen before showing
    screen.prepare();

    // Add update function if available
    this.app.ticker.add(screen.update, screen);

    // Show the new screen
    screen.interactiveChildren = false;
    await screen.show();
    screen.interactiveChildren = true;
  }

  /** Remove screen from the stage, unlink update & resize functions */
  private async hideAndRemoveScreen(screen: BaseScreen) {
    // Prevent interaction in the screen
    screen.interactiveChildren = false;

    // Hide screen if method is available
    await screen.hide();

    // Unlink update function if method is available
    this.app.ticker.remove(screen.update, screen);

    // Remove screen from its parent (usually app.stage, if not changed)
    if (screen.parent) {
      screen.parent.removeChild(screen);
    }

    // Clean up the screen so that instance can be reused again later
    screen.reset();
  }

  /**
   * Hide current screen (if there is one) and present a new screen.
   * Any class that matches BaseScreen can be used here.
   */
  public async showScreen(ctor: AppScreenConstructor) {
    // Block interactivity in current screen
    if (this.currentScreen) {
      this.currentScreen.interactiveChildren = false;
    }

    // Load assets for the new screen, if available
    if (ctor.assetBundles) {
      // Load all assets required by this new screen
      await Assets.loadBundle(ctor.assetBundles, (progress) => {
        this.currentScreen?.onLoad(progress * 100);
      });
    }

    this.currentScreen?.onLoad(100);

    // If there is a screen already created, hide and destroy it
    if (this.currentScreen) {
      await this.hideAndRemoveScreen(this.currentScreen);
    }

    // Create the new screen and add that to the stage
    this.currentScreen = BigPool.get(ctor);
    await this.addAndShowScreen(this.currentScreen);
  }

  /**
   * Resize screens
   * @param width Viewport width
   * @param height Viewport height
   */
  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.layout = createScreenLayout(width, height);

    this.currentScreen?.resize(this.layout);
    this.currentPopup?.resize(this.layout);
    this.background?.resize(this.layout);
  }

  /**
   * Show up a popup over current screen
   */
  public async presentPopup(ctor: AppScreenConstructor) {
    if (this.currentScreen) {
      this.currentScreen.interactiveChildren = false;
      await this.currentScreen.pause?.();
    }

    if (this.currentPopup) {
      await this.hideAndRemoveScreen(this.currentPopup);
    }

    this.currentPopup = new ctor();
    await this.addAndShowScreen(this.currentPopup);
  }

  /**
   * Dismiss current popup, if there is one
   */
  public async dismissPopup() {
    if (!this.currentPopup) return;
    const popup = this.currentPopup;
    this.currentPopup = undefined;
    await this.hideAndRemoveScreen(popup);
    if (this.currentScreen) {
      this.currentScreen.interactiveChildren = true;
      this.currentScreen.resume?.();
    }
  }

  /**
   * Blur screens when lose focus
   */
  public blur() {
    this.currentScreen?.blur();
    this.currentPopup?.blur();
    this.background?.blur();
  }

  /**
   * Focus screens
   */
  public focus() {
    this.currentScreen?.focus();
    this.currentPopup?.focus();
    this.background?.focus();
  }
}
