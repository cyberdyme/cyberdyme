import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  constructor() {}
  /** Template reference to the canvas element */
  @ViewChild('canvasEl') canvasEl: ElementRef;

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.context = (this.canvasEl
      .nativeElement as HTMLCanvasElement).getContext('2d');

    setInterval(() => {
      this.pVoronoiD();
    }, 1000);
    //this.draw();
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  private draw() {
    this.context.font = '30px Arial';
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

    const x1 = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
    const y1 = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;
    this.context.fillText('@realappie', x1, y1);

    const canvas = this.canvasEl.nativeElement as HTMLCanvasElement;
    const stars = 500;
    const colorrange = [0, 60, 240];
    for (let i = 0; i < stars; i++) {
      const x = Math.random() * canvas.offsetWidth;
      const y = Math.random() * canvas.offsetHeight;
      const radius = Math.random() * 1.2;
      const hue = colorrange[this.getRandom(0, colorrange.length - 1)];
      const sat = this.getRandom(50, 100);
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 360);
      this.context.fillStyle = 'hsl(' + hue + ', ' + sat + '%, 88%)';
      this.context.fill();
    }
  }

  open() {
    window.open('https://github.com/realappie', '_blank');
  }

  getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randgp(max: number) {
    return Math.floor(Math.random() * max);
  }

  randhclr() {
    return (
      '#' +
      ('00' + this.randgp(256).toString(16)).slice(-2) +
      ('00' + this.randgp(256).toString(16)).slice(-2) +
      ('00' + this.randgp(256).toString(16)).slice(-2)
    );
  }

  Metric(x, y, mt) {
    if (mt === 1) {
      return Math.sqrt(x * x + y * y);
    }
    if (mt === 2) {
      return Math.abs(x) + Math.abs(y);
    }
    if (mt === 3) {
      return Math.pow(
        Math.pow(Math.abs(x), 3) + Math.pow(Math.abs(y), 3),
        0.33333
      );
    }
  }

  pVoronoiD() {
    const cvs = this.canvasEl.nativeElement as HTMLCanvasElement;
    const ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );

    const w = cvs.width;
    const h = cvs.height;
    let x = 0;
    let y = 0;
    let d = 0;
    let dm = 0;
    let j = 0;

    const w1 = w - 2;
    const h1 = h - 2;
    const n = 50;
    const mt = 1;

    const X = new Array(n);
    const Y = new Array(n);
    const C = new Array(n);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
      X[i] = this.randgp(w1);
      Y[i] = this.randgp(h1);
      C[i] = this.randhclr();
    }
    for (y = 0; y < h1; y++) {
      for (x = 0; x < w1; x++) {
        dm = this.Metric(h1, w1, mt);
        j = -1;
        for (let i = 0; i < n; i++) {
          d = this.Metric(X[i] - x, Y[i] - y, mt);
          if (d < dm) {
            dm = d;
            j = i;
          }
        }
        ctx.fillStyle = C[j];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    ctx.fillStyle = 'black';
    for (let i = 0; i < n; i++) {
      ctx.fillRect(X[i], Y[i], 3, 3);
    }
  }
}

/*

<!-- VoronoiD.html -->
<html>
<head><title>Voronoi diagram</title>
<script>
// HF#1 Like in PARI/GP: return random number 0..max-1
function randgp(max) {return Math.floor(Math.random()*max)}
// HF#2 Random hex color
function randhclr() {
  return "#"+
  ("00"+randgp(256).toString(16)).slice(-2)+
  ("00"+randgp(256).toString(16)).slice(-2)+
  ("00"+randgp(256).toString(16)).slice(-2)
}
// HF#3 Metrics: Euclidean, Manhattan and Minkovski 3/20/17
function Metric(x,y,mt) {
  if(mt==1) {return Math.sqrt(x*x + y*y)}
  if(mt==2) {return Math.abs(x) + Math.abs(y)}
  if(mt==3) {return(Math.pow(Math.pow(Math.abs(x),3) + Math.pow(Math.abs(y),3),0.33333))}
}
// Plotting Voronoi diagram. aev 3/10/17
function pVoronoiD() {
  var cvs=document.getElementById("cvsId");
  var ctx=cvs.getContext("2d");
  var w=cvs.width, h=cvs.height;
  var x=y=d=dm=j=0, w1=w-2, h1=h-2;
  var n=document.getElementById("sites").value;
  var mt=document.getElementById("mt").value;
  var X=new Array(n), Y=new Array(n), C=new Array(n);
  ctx.fillStyle="white"; ctx.fillRect(0,0,w,h);
  for(var i=0; i<n; i++) {
    X[i]=randgp(w1); Y[i]=randgp(h1); C[i]=randhclr();
  }
  for(y=0; y<h1; y++) {
    for(x=0; x<w1; x++) {
      dm=Metric(h1,w1,mt); j=-1;
      for(var i=0; i<n; i++) {
        d=Metric(X[i]-x,Y[i]-y,mt)
        if(d<dm) {dm=d; j=i;}
      }//fend i
      ctx.fillStyle=C[j]; ctx.fillRect(x,y,1,1);
    }//fend x
  }//fend y
  ctx.fillStyle="black";
  for(var i=0; i<n; i++) {
    ctx.fillRect(X[i],Y[i],3,3);
  }
}
</script></head>
<body style="font-family: arial, helvatica, sans-serif;">
  <b>Please input number of sites: </b>
  <input id="sites" value=100 type="number" min="10" max="150" size="3">&nbsp;&nbsp;
  <b>Metric: </b>
  <select id="mt">
    <option value=1 selected>Euclidean</option>
    <option value=2>Manhattan</option>
    <option value=3>Minkovski</option>
  </select>&nbsp;
  <input type="button" value="Plot it!" onclick="pVoronoiD();">&nbsp;&nbsp;
  <h3>Voronoi diagram</h3>
  <canvas id="cvsId" width="640" height="640" style="border: 2px inset;"></canvas>
</body>
</html>



*/
