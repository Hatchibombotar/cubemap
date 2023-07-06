# @hatchibombotar/cubemap

A simple and performant cubemap viewer, using the power of css transformations.

### Installation

```sh
npm i @hatchibombotar/cubemap
```

### Getting started

```js
new Cubemap(
    container,
    [
        "cubemap_front.png",
        "cubemap_right.png",
        "cubemap_back.png",
        "cubemap_left.png",
        "cubemap_top.png",
        "cubemap_bottom.png",
    ],
    { rotate_type: "drag"}
)
```
Create a simple cubemap inside a parent container, where the user drags to move the view around the cubemap.

### Options
```ts
{
    width: number | string,
    height: number | string,
    background_color: string,
    perspective: number | string,
    min_pitch: number | false,
    max_pitch: number | false,
    
    rotate_type: "drag" | "auto",
    drag_speed: number
    rotate_speed: number,
}
```

- **width** - width of the cubemap element. If given as a number - measurement is in pixels. Default: `500`
- **height** - height of the cubemap element. number or string, if number - measurement is in pixels. Default: `500`
- **background_color** - the css colour of the background shown behind the cubemap.  Default: `"black"`
- **perspective** - The css perspective value of the cubemap. If given as a number - measurement is in pixels. Default: `300`
- **min_pitch** - The minimum pitch can be dragged to if in drag mode. Default: `-90`
- **max_pitch** - The maximum pitch can be dragged to if in drag mode. Default: `90`
- **rotate_type** - The type of controls the cubemap has. If `"drag"` then the user can drag around the cubemap with their mouse. If `"auto"`, it will automatically rotate around the camera. Default: `"drag"`
- **drag_speed** - The speed the cubemap moves in drag mode. Default: `0.25`
- **rotate_speed** - The speed the cubemap moves in auto mode. Default: `3`