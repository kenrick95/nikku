
      declare module "comlink:../audio-decoder/worker" {
        const mod: () => import("comlink").Remote<typeof import("./src/audio-decoder/worker")>
        export default mod
      }