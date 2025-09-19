import "./index.css";
export type CubemapOptions = {
    width?: number | string;
    height?: number | string;
    background_color?: string;
    perspective?: number | string;
    min_pitch?: number | false;
    max_pitch?: number | false;
    rotate_type?: "drag" | "auto";
    drag_speed?: number;
    rotate_speed?: number;
};
type StrictCubemapOptions = {
    width: number | string;
    height: number | string;
    background_color: string;
    perspective: number | string;
    min_pitch: number | false;
    max_pitch: number | false;
    rotate_type: "drag" | "auto";
    drag_speed: number;
    rotate_speed: number;
};
export declare const defaultCubemapOptions: StrictCubemapOptions;
type CubemapImageArray = [string, string, string, string, string, string];
export declare class Cubemap {
    pitch: number;
    yaw: number;
    perspective: number | string;
    box_size: number;
    border_margin: number;
    images: CubemapImageArray | string;
    root: HTMLDivElement;
    center: HTMLDivElement;
    options: StrictCubemapOptions;
    constructor(container: HTMLElement, images: CubemapImageArray | string, providedOptions?: CubemapOptions);
    load(): void;
    update(): void;
}
export {};
