import { Component, onMount } from 'solid-js';

import favicon from './assets/favicon.png';

import { Cubemap, CubemapOptions } from "../../src/index"

import Markdown from 'solid-markdown';

import readme from "../../readme.md?raw"

import { FaBrandsNpm, FaBrandsGithub } from 'solid-icons/fa'

const NPM_URL = "https://www.npmjs.com/package/@hatchibombotar/cubemap"
const GITHUB_URL = "https://github.com/Hatchibombotar/cubemap"
const MAIN_SITE_URL = "https://www.hatchibombotar.com/"

const App: Component = () => {
  return (
    <div class="mx-auto max-w-2xl my-4">
      <header class="flex items-center mt-5 mb-2 mx-4">
        <a href={NPM_URL}>
          <FaBrandsNpm size={32} class="mr-4" />
        </a>
        <a href={GITHUB_URL}>
          <FaBrandsGithub size={32} class="mr-4" />
        </a>
        <a href={MAIN_SITE_URL} class="ml-auto">
          <img src={favicon} class="h-10" />
        </a>
      </header>
      <hr class="mb-5" />
      <main class="mx-4">
        <h2 class="text-gray-800 mb-2">readme.md</h2>
        <Markdown class="prose max-w-2xl">
          {readme}
        </Markdown>
        <hr class="my-5" />

        <div class="prose max-w-2xl">
          <h2 class="">examples</h2>
          <h3>rotate_type: "drag"</h3>
          <CubemapExample options={{ "rotate_type": "drag", width: "42rem", height: "42rem" }} />
          <h3>rotate_type: "auto"</h3>
          <CubemapExample options={{ "rotate_type": "auto", width: "42rem", height: "42rem" }} />
        </div>
      </main>
      <hr class="my-5" />
      <footer class="prose prose-sm mx-4">
        <span class="block my-1">Copyright (c) 2023 Hatchibombotar</span>
        <span class="block my-1">Package and website created by <a href={MAIN_SITE_URL}>Hatchibombotar</a>.</span>
        <span>Licenced under the <a href={MAIN_SITE_URL}>MIT License</a>.</span>
      </footer>
    </div>
  );
};

function CubemapExample({ options }: { options: CubemapOptions }) {
  let container: HTMLDivElement | undefined;
  onMount(
    () => {
      if (container == undefined) {
        console.error("cubemap container was undefined after mount")
        return
      }
      new Cubemap(
        container,
        [
          "panorama_0.png",
          "panorama_1.png",
          "panorama_2.png",
          "panorama_3.png",
          "panorama_4.png",
          "panorama_5.png",
        ],
        options
      )
    }
  )

  return <div ref={container}></div>
}

export default App;
