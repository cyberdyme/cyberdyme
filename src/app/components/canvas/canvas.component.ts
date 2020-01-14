import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as PIXI from 'pixi.js';

class GradientResource extends PIXI.resources.Resource {
  constructor() {
    // pass width and height. (0,0) if we dont know yet
    // gradient needs only 1 pixel height
    super(256, 1);
  }

  upload(renderer, baseTexture, glTexture) {
    const { width } = this; // default size or from baseTexture?
    const { height } = this; // your choice.

    // temporary canvas, we dont need it after texture is uploaded to GPU
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    const grd = ctx.createLinearGradient(0, 0, width, 0);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
    grd.addColorStop(0.3, 'cyan');
    grd.addColorStop(0.7, 'red');
    grd.addColorStop(1, 'green');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // This info ios usseful if upload happens second time
    // Some people use that to track used memory
    glTexture.width = width;
    glTexture.height = height;

    // PURE WEBGL CALLS - that's what its all about.
    // PixiJS cant wrap all that API, we give you acceess to it!
    const { gl } = renderer;
    gl.pixelStorei(
      gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      baseTexture.premultiplyAlpha
    );
    gl.texImage2D(
      baseTexture.target,
      0,
      baseTexture.format,
      baseTexture.format,
      baseTexture.type,
      canvas
    );

    return true;
  }
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer: ElementRef;

  public app: any;
  constructor() {
    this.app = new PIXI.Application({
      width: 1200,
      height: 60,
      backgroundColor: 0xff0000
    });
  }

  ngAfterViewInit() {
    this.canvasContainer.nativeElement.appendChild(this.app.view);

    const gradBaseTexture = new PIXI.BaseTexture(new GradientResource());
    // Here you can fake baseTexture size to avoid resizing all sprites
    // There can be multiple baseTextures per gradient, but be careful:
    // resource will spawn more glTextures!
    gradBaseTexture.setSize(1200, 60);

    const gradTexture = new PIXI.Texture(gradBaseTexture);

    const sprite = new PIXI.Sprite(gradTexture);
    sprite.position.set(0, 0);
    //sprite.rotation = Math.PI / 8;
    this.app.stage.addChild(sprite);

    const basicText = new PIXI.Text('Cyberdyme');
    basicText.x = 4;
    basicText.y = 8;
    this.app.stage.addChild(basicText);
  }
}
