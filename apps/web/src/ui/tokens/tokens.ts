export type ThemeMode = "light" | "dark";
export type DensityMode = "comfortable" | "compact";
export type LayoutMode = "hub" | "workbench";

export interface ThemeConfig {
  theme: ThemeMode;
  density: DensityMode;
  layout: LayoutMode;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  theme: "light",
  density: "comfortable",
  layout: "hub",
};

export function applyThemeConfig(config: Partial<ThemeConfig>): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (config.theme) root.setAttribute("data-theme", config.theme);
  if (config.density) root.setAttribute("data-density", config.density);
  if (config.layout) root.setAttribute("data-layout", config.layout);
}
