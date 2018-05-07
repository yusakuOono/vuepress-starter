import {
  Scene,
  WebGLRenderTarget,
  UnsignedByteType,
  FloatType,
  Object3D,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  Color
} from 'three'
import { MeshText2D, textAlign} from 'three-text2d'
import Data from '@canvas/store/Data'
import Params from '../util/Params';
import { map } from '../util/Util'

export default class TextRenderTexture extends Scene {
  constructor(renderer, camera) {
    super()
    this.renderer = renderer
    this.camera = camera
    // this.background = 0x000000
    this.renderTarget = new WebGLRenderTarget(16, 16, {
      type: (Data.isMobile) ? UnsignedByteType : FloatType,
      depthBuffer: false,
      stencilBuffer: false
    })
    this.renderTarget.texture.generateMipmaps = false

    this.plane = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new MeshBasicMaterial({
        color: 0x000000
      })
    )

    this.add(this.plane)
    this.textStr = ''
    this.makeText()
    this.resize()
  }

  makeText() {
    if(this.text){
      this.remove(this.text)
      this.text.mesh.material.dispose()
      this.text.mesh.geometry.dispose()
      this.text = null
    }

    this.text = new MeshText2D(this.textStr, {
      align: textAlign.center,
      font: `${Data.canvas.height}px YuuriFont`,
      fillStyle: '#FFFFFF',
      antialias: true
    })
    this.add(this.text)
  }
  resize() {
    const ratio = window.devicePixelRatio || 1
    this.renderTarget.setSize(Data.canvas.width * ratio, Data.canvas.height * ratio)
    this.makeText()
    this.text.position.y = Data.canvas.height / 2
    this.plane.scale.set(Data.canvas.width, Data.canvas.height, 1)
  }

  setText(text) {
    this.textStr = text
    this.text.text = text
  }

  get texture(){
    return this.renderTarget.texture
  }
  render(){
    this.renderer.render(this, this.camera, this.renderTarget)
  }

}
