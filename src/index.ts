import "./index.css"
export type CubemapOptions = {
    width?: number | string,
    height?: number | string,
    background_color?: string,
    perspective?: number | string,
    min_pitch?: number | false,
    max_pitch?: number | false,
    
    rotate_type?: "drag" | "auto",
    drag_speed?: number,
    rotate_speed?: number,
}

type StrictCubemapOptions = {
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

export const defaultCubemapOptions: StrictCubemapOptions = {
    width: 500,
    height: 500,
    perspective: 300,
    background_color: "black",
    min_pitch: -90,
    max_pitch: 90,
    rotate_type: "drag",
    drag_speed: 0.25,
    rotate_speed: 3
}

enum Directions {
    FRONT,
    RIGHT,
    BACK,
    LEFT,
    TOP,
    BOTTOM,
}

export class Cubemap {
    pitch: number
    yaw: number
    perspective: number | string

    box_size: number
    border_margin: number

    images: string[]

    root: HTMLDivElement
    center: HTMLDivElement
    options: StrictCubemapOptions

    constructor(
        container: HTMLElement,
        images: [
            string,
            string,
            string,
            string,
            string,
            string
        ],
        providedOptions: CubemapOptions = {}
    ) {
        const options: StrictCubemapOptions = {
            ...defaultCubemapOptions,
            ...providedOptions
        }
        this.options = options

        this.pitch = 0
        this.yaw = 0
        this.perspective = options.perspective
        this.box_size = 1024
        this.border_margin = 1
        this.images = images

        const parent = container

        const root = document.createElement("div")
        this.root = root
        root.className = "cubemap"
        parent.appendChild(root)


        if (typeof options.width == "number") {
            root.style.width = options.width + "px"
        } else {
            root.style.width = options.width
        }

        if (typeof options.height == "number") {
            root.style.height = options.height + "px"
        } else {
            root.style.height = options.height
        }
        
        root.style.backgroundColor = options.background_color
        root.style.position = "relative"
        root.style.overflow = "hidden"

        let last_pos = [0, 0]

        const ondown = (e: MouseEvent | TouchEvent) => {
            if (e.type == "touchstart") {
                document.addEventListener("touchmove", onmove)
                document.addEventListener("touchend", onup)
            }
            else {
                document.body.addEventListener("mousemove", onmove)
                document.body.addEventListener("mouseup", onup)
            }

            const rect = root.getClientRects()[0]
            // @ts-ignore
            last_pos = [e.pageX - rect.left, e.pageY - rect.top]

            e.stopPropagation()
            e.preventDefault()
            return false

        }
        const onmove = (e: MouseEvent | TouchEvent) => {

            const rect = this.root.getClientRects()[0]
            // @ts-ignore
            const x = e.pageX - rect.left
            // @ts-ignore
            const y = e.pageY - rect.top
            const deltax = x - last_pos[0]
            const deltay = y - last_pos[1]

            this.yaw -= deltax * options.drag_speed
            this.pitch += deltay * options.drag_speed
            if (options.min_pitch && this.pitch < options.min_pitch) this.pitch = options.min_pitch
            if (options.max_pitch && this.pitch > options.max_pitch) this.pitch = options.max_pitch
            this.update()

            last_pos = [x, y]
            e.stopPropagation()
            e.preventDefault()
            return false
        }
        const onup = (e: MouseEvent | TouchEvent) => {
            document.body.removeEventListener("mousemove", onmove)
            document.body.removeEventListener("mouseup", onup)
            document.body.removeEventListener("touchmove", onmove)
            document.body.removeEventListener("touchend", onup)

            e.stopPropagation()
            e.preventDefault()
            return false
        }

        if (options.rotate_type == "drag") {
            root.addEventListener("mousedown", ondown)
            root.addEventListener("touchstart", ondown)
        }

        const center = document.createElement("div")
        center.className = "cubemapcenter"
        root.appendChild(center)
        center.style.transformStyle = "preserve-3d"
        center.style.width = "100%"
        center.style.height = "100%"
        this.center = center

        if (options.rotate_type == "drag") {
            root.style.cursor = "grab"
        } else if (options.rotate_type == "auto") {
            center.classList.add("spin-3d-y")
            this.center.style.setProperty('--spin-time', 360 / options.rotate_speed + "s");
        }

        this.load()
        this.update()
    }

    load() {
        const halfsize = (this.box_size * 0.5 - this.border_margin).toFixed(1)
        const transformations = {
            [Directions.FRONT]: `translateZ(-${halfsize}px) rotateY(0deg)`,
            [Directions.LEFT]: `translateX(-${halfsize}px) rotateY(90deg)`,
            [Directions.RIGHT]: `translateX(${halfsize}px) rotateY(-90deg)`,
            [Directions.TOP]: `translateY(-${halfsize}px) rotateX(-90deg)`,
            [Directions.BOTTOM]: `translateY(${halfsize}px) rotateX(90deg)`,
            [Directions.BACK]: `translateZ(${halfsize}px) rotateY(-180deg)`,
        }

        for (const face of [
            Directions.FRONT, Directions.LEFT, Directions.RIGHT, Directions.TOP, Directions.BOTTOM, Directions.BACK
        ]) {
            const url = this.images[face]
            const element = document.createElement("div")
            element.className = "cubemapface " + face + "face"
            this.center.appendChild(element)

            const transform = transformations[face]


            element.style.position = "absolute"
            element.style.left = "0"
            element.style.top = "0"
            element.style.width = this.box_size + "px"
            element.style.height = this.box_size + "px"
            element.style.transform = transform

            // create image
            const img = new Image()
            img.src = url
            img.onload = () => {
                img.width = this.box_size
                img.height = this.box_size
            }

            element.appendChild(img)
        }
    }

    update() {
        const perspective = this.perspective

        if (typeof perspective == "number") {
            this.root.style.perspective = perspective.toFixed(0) + "px"
        } else {
            this.root.style.perspective = perspective
        }

        const rect = this.root.getClientRects()[0]
        const offsetX = (rect.width - this.box_size) * 0.5
        const offsetY = (rect.height - this.box_size) * 0.5

        if (this.options.rotate_type == "drag") {
            this.center.style.transform = "translateZ(" + this.root.style.perspective + ") rotateX(" + this.pitch.toFixed(1) + "deg) rotateY(" + this.yaw.toFixed(1) + "deg) translateX(" + offsetX + "px) translateY(" + offsetY + "px)"
        } else if (this.options.rotate_type == "auto") {
            this.center.style.setProperty('--offset-z', this.root.style.perspective);
            this.center.style.setProperty('--offset-x', offsetX + "px");
            this.center.style.setProperty('--offset-y', offsetY.toFixed(1) + "px");
        }
    }
}
