import './style.css';

export class Clock {
  timeOffset: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  midPoint: number;

  public constructor(canvas: HTMLElement, timeOffset: number) {
    this.timeOffset = timeOffset;
    this.canvas = canvas as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.context.shadowBlur = 0.25;
    this.context.shadowColor = "black"
    let rect = canvas.getBoundingClientRect();
    this.width = this.height = Math.min(rect.height, rect.width);
    this.midPoint = this.width / 2;

    this.update();
    setInterval(this.update.bind(this), 1000);
  }

  renderBackGround() {
    let ctx = this.context; // Reduce boilerplate    
    ctx.beginPath();
    ctx.strokeStyle = "#888";
    ctx.fillStyle = "whitesmoke";
    ctx.lineWidth = this.midPoint / 13.75;
    ctx.arc(this.midPoint, this.midPoint, this.midPoint - 5, 0, 6.28);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = "#F00";
    ctx.fillStyle = "#F00";
    ctx.font = (this.midPoint / 6.8) + "px arial";

    let minuteAngle = (2 * Math.PI) / 60;

    let j = 0;
    for (let i = 0; i < (Math.PI * 2); i = i + minuteAngle) {


      let h = i;
      let cos = Math.cos(h);
      let sin = Math.sin(h);

      let x = this.midPoint + this.midPoint / 1.15 * cos;
      let y = this.midPoint + this.midPoint / 1.15 * sin;

      let x1 = this.midPoint + this.midPoint / 1.20 * cos;
      let y1 = this.midPoint + this.midPoint / 1.20 * sin;

      let x2 = this.midPoint + this.midPoint / 1.25 * cos;
      let y2 = this.midPoint + this.midPoint / 1.25 * sin;

      ctx.moveTo(x, y);

      if (j % 5 == 0) {
        ctx.lineTo(x2, y2);

        ctx.textAlign = "center";
        let tp = (j * minuteAngle) - 15 * minuteAngle;
        let x3 = this.midPoint + this.midPoint / 1.47 * Math.cos(tp);
        let y3 = this.midPoint + 5 + this.midPoint / 1.47 * Math.sin(tp);
        if (j) {
          ctx.fillText((j / 5).toString(), x3, y3);
        }

      } else {
        ctx.lineTo(x1, y1);
      }
      j++;
    }
    ctx.stroke();
    ctx.closePath();
  }

  renderDate(day: number) {
    let ctx = this.context; // Reduce boilerplate 
    let sDay = (day < 10) ? ("0" + day) : day.toString();
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.font = (this.midPoint / 10) + "px arial";
    ctx.lineCap = "round";
    ctx.lineWidth = 0.75;

    let rectSize = this.midPoint / 6.9;
    ctx.strokeRect(this.midPoint * 1.5 - rectSize, this.midPoint - rectSize / 2, rectSize, rectSize);
    ctx.fillText(sDay, this.midPoint * 1.5 - rectSize / 2, this.midPoint + rectSize / 4);
    ctx.closePath();
  }

  renderHour(hour: number) {
    let ctx = this.context; // Reduce boilerplate 
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this.midPoint / 15;
    ctx.strokeStyle = "#555";
    ctx.moveTo(this.midPoint, this.midPoint);
    ctx.lineTo(this.midPoint + this.midPoint / 2 * Math.cos(hour), this.midPoint + this.midPoint / 2 * Math.sin(hour));
    ctx.stroke();
    ctx.closePath();
  }

  renderMinute(min: number) {
    let ctx = this.context; // Reduce boilerplate 
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this.midPoint / 22;
    ctx.strokeStyle = "#999";
    ctx.moveTo(this.midPoint, this.midPoint);
    ctx.lineTo(this.midPoint + this.midPoint / 1.5 * Math.cos(min), this.midPoint + this.midPoint / 1.5 * Math.sin(min));
    ctx.stroke();
    ctx.closePath();
  }

  renderSecond(sec: number) {
    let ctx = this.context; // Reduce boilerplate 
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this.midPoint / 36.6;
    ctx.strokeStyle = "#a00";
    ctx.moveTo(this.midPoint, this.midPoint);
    ctx.lineTo(this.midPoint + this.midPoint / 1.28 * Math.cos(sec), this.midPoint + this.midPoint / 1.28 * Math.sin(sec));
    ctx.stroke();
    ctx.closePath();
  }

  update() {

    let ctx = this.context; // Reduce boilerplate 
    ctx.clearRect(0, 0, this.width, this.height);

    this.renderBackGround();

    let d = new Date();
    let date = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
    date.setMilliseconds(d.getUTCMilliseconds() + (this.timeOffset * 60 * 60 * 1000));

    let day = date.getDate();
    let rawMs = date.getMilliseconds();
    let rawSec = date.getSeconds();
    let rawMin = date.getMinutes();
    let rawHour = date.getHours();

    let hourAngle = (2 * Math.PI) / 12;
    let minuteAngle = hourAngle / 5;
    let secondAngle = minuteAngle;
    let msAngle = secondAngle / 1000;

    let currection = Math.PI / 2;
    let ms = (rawMs * msAngle);
    let sec = (rawSec * secondAngle) - currection;// + ((rawMs * msAngle));
    let min = (rawMin * minuteAngle) + ((rawSec * secondAngle) / 60) - currection;
    let hour = (rawHour * hourAngle) + ((rawMin * minuteAngle) / 12) - currection;

    this.renderDate(day);
    this.renderHour(hour);
    this.renderMinute(min);
    this.renderSecond(sec);

    ctx.fillStyle = "#444";
    ctx.arc(this.midPoint, this.midPoint, this.midPoint / 18.3, 0, 2 * Math.PI);
    ctx.fill();
  }
}

new Clock(document.getElementById('canvas'), -4);

new Clock(document.getElementById('canvas1'), 3.5);

new Clock(document.getElementById('canvas2'), -7);

new Clock(document.getElementById('canvas3'), +2);