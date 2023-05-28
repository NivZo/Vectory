import { gameSession } from "../stores/GameSessionStore";
import type { Coordinate } from "../types/Coordinate";

export type DrawEngine = {
    drawGrid: () => void,
    drawAxes: () => void,
    drawPoint: (crd: Coordinate, includeText: boolean, color: string) => void,
    drawVector: (source: Coordinate, target: Coordinate, color: string) => void,
}

export const initDrawEngine = (canvas: HTMLCanvasElement, axisLength: number): DrawEngine => {
    const width = canvas.width;
    const height = canvas.height;
    const step = width / axisLength;
    const halfAxisLength = axisLength / 2;
    const fontSize = 15;
    const axisWidth = 1;
    const notchHeight = 10;
    const notchWidth = 2;
    const ctx = canvas.getContext('2d');

    return {
        drawGrid: () => {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();

            for (let x = -halfAxisLength; x <= halfAxisLength; x++) {
                const xPos = (x + halfAxisLength) * step;
                ctx.lineWidth = axisWidth;
                ctx.strokeStyle = '#ccc';
                ctx.moveTo(xPos, 0);
                ctx.lineTo(xPos, height);
                ctx.stroke();

                if (x % 2 === 0 && x != 0 && x < axisLength/2 && x > -axisLength/2) {
                    // number
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.fillText(x.toString(), xPos, height/2 + 25);

                }
                // notch
                ctx.beginPath();
                ctx.moveTo(xPos, height/2);
                ctx.lineTo(xPos, height/2 + notchHeight);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "black";
                ctx.lineWidth = notchWidth;
                ctx.stroke();
            }

            for (let y = -halfAxisLength; y <= halfAxisLength; y++) {
                const yPos = (y + halfAxisLength) * step;
                ctx.lineWidth = axisWidth;
                ctx.strokeStyle = '#ccc';
                ctx.moveTo(0, yPos);
                ctx.lineTo(width, yPos);
                ctx.stroke();

                if (y % 2 === 0 && y != 0 && y < axisLength/2 && y > -axisLength/2) {
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.fillText(y.toString(), width/2 - 25, yPos + fontSize/3);
                }
                // notch
                ctx.beginPath();
                ctx.moveTo(width/2, yPos);
                ctx.lineTo(width/2 - notchHeight, yPos);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "black";
                ctx.lineWidth = notchWidth;
                ctx.stroke();

                ctx.lineWidth = axisWidth;
                ctx.strokeStyle = '#ccc';
            }
        },

        drawAxes: () => {
            ctx.strokeStyle = 'black';
            ctx.beginPath();

            // Draw x-axis
            const xAxisY = height / 2;
            ctx.moveTo(0, xAxisY);
            ctx.lineTo(width, xAxisY);

            // Draw y-axis
            const yAxisX = width / 2;
            ctx.moveTo(yAxisX, 0);
            ctx.lineTo(yAxisX, height);

            ctx.stroke();
        },

        drawPoint: (crd: Coordinate, includeText: boolean, color: string) => {
            const xPos = (crd.x + halfAxisLength) * step;
            const yPos = height - (crd.y + halfAxisLength) * step;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
            ctx.fill();

            if (includeText) {
                ctx.fillStyle = color;
                const xOffest = 20 // crd.x > 10 ? 2*fontSize : -2*fontSize;
                const yOffest = 20 // crd.y > 10 ? 2*fontSize : -2*fontSize;
                ctx.fillText(`(${crd.x} , ${crd.y})`, xPos + xOffest, yPos + yOffest);
            }
        },

        drawVector: (source: Coordinate, target: Coordinate, color: string) => {
            const sourceX = (source.x + halfAxisLength) * step;
            const sourceY = height - (source.y + halfAxisLength) * step;
            const targetX = (target.x + halfAxisLength) * step;
            const targetY = height - (target.y + halfAxisLength) * step;

            const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
            const arrowSize = 10;

            ctx.strokeStyle = color;
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.lineTo(targetX, targetY);

            // Draw arrowhead
            ctx.lineTo(
                targetX - arrowSize * Math.cos(angle - Math.PI / 6),
                targetY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(targetX, targetY);
            ctx.lineTo(
                targetX - arrowSize * Math.cos(angle + Math.PI / 6),
                targetY - arrowSize * Math.sin(angle + Math.PI / 6)
            );

            ctx.stroke();

            // Draw slim line
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();

            // Draw slim arrowhead
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(
                targetX - arrowSize * Math.cos(angle - Math.PI / 6),
                targetY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(targetX, targetY);
            ctx.lineTo(
                targetX - arrowSize * Math.cos(angle + Math.PI / 6),
                targetY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
        },
    };
};